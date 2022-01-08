import {tabControlAttachJs, tabControlDynamicJs} from "./tabControl";
import {RadicalLookup} from "./radicalLookup";
import {DataSourceLookup} from "./dataSourceLookup";
import {radicalControlAttachJs} from "./radicalControl";
import {dataSourceGridAttachJs, dataSourceGridLookup, DataSourceLayoutConfig} from "./dataSourceGrid";
import {
    japaneseInputAttachJs,
    japaneseInputInsertText,
    japaneseInputReplaceText,
    japaneseInputResetText
} from "./japaneseInput";
import {WordInfoLookup} from "./wordInfoLookup";
import {projectWindowAttachJs} from "./projectWindow";
import {api, isPrivateMode} from "./api";
import {aboutSectionAttachJs} from "./aboutSection";
import {kanaBoardAttachJs} from "./kanaBoard";
import {projectInputAttachJs, updateSimilarCharactersPicker} from "./projectInput";
import {WordInfoResponse} from "../api/src";
import {settingsPanelAttachJs} from "./settingsPanel";
import {map} from "lodash";
import {shim} from "globalthis"
import {Throttler} from "./throttler";
import {makeElement, removeAllChildElements} from "./utility";

shim();

window.addEventListener('load', async () => {
    try {
        const radicalLookup = new RadicalLookup();
        const dataSourceLookup = new DataSourceLookup();
        const wordInfoLookup = new WordInfoLookup();

        const kanaPromise = api.listKana();
        const sessionConfigPromise = api.loadSession();
        const sessionConfig = await sessionConfigPromise;
        const kana = await kanaPromise;

        let dataLayouts;

        if (sessionConfig.isDefault && !isPrivateMode) {
            const rawData = window.localStorage.getItem("configuration-layouts");
            if (rawData !== null) {
                dataLayouts = JSON.parse(rawData);
            } else {
                dataLayouts = sessionConfig.dataSourceGridLayouts;
            }
        } else {
            dataLayouts = sessionConfig.dataSourceGridLayouts;
        }

        async function replaceText(text: string) {
            await japaneseInputReplaceText(wordInfoLookup, text, similarCharactersRefresh);
        }

        async function resetText(text: string) {
            await japaneseInputResetText(wordInfoLookup, text, similarCharactersRefresh);
        }

        const refreshCurrentDataSources = async (text, position, positionEnd) => {
            const result = await wordInfoLookup.getWordInfo(text);
            const charactersRefreshPromise = similarCharactersRefresh(text.substring(position,
                position == positionEnd
                    ? position + 1
                    : positionEnd
            ), result);
            const dataSources = document.querySelector(".tabcontrol-tabcontent-selected .data-sources");
            if (dataSources) {
                await dataSourceGridLookup(dataSources, dataSourceLookup, text, position, positionEnd);
            }
            await charactersRefreshPromise;
        };

        globalThis.clipboardNotification = async function (content: string) {
            await resetText(content);
            await refreshCurrentDataSources(content, 0, 0);
        };

        async function similarCharactersRefresh(selectedText: string, wordInfoResponse: WordInfoResponse) {
            const charactersElement = document.querySelector(".tabcontrol-tabcontent-selected .similar-characters-picker");
            if (charactersElement) {
                updateSimilarCharactersPicker(charactersElement, selectedText, wordInfoResponse, replaceText);
            }
        }

        async function insertText(text: string) {
            await japaneseInputInsertText(wordInfoLookup, text, similarCharactersRefresh);
        }

        const saveLayoutConfigThrottler = new Throttler(async () => {
            const config = new DataSourceLayoutConfig(dataSources, saveLayoutConfigCallback);
            const layouts = map(document.getElementsByClassName("data-sources"), (element) =>
                config.serialize(element as HTMLElement))
            if (isPrivateMode) {
                await api.saveSession({
                    body: {
                        dataSourceGridLayouts: layouts
                    }
                });
            } else {
                window.localStorage.setItem(
                    "configuration-layouts",
                    JSON.stringify(layouts));
            }
        }, 100);

        async function saveLayoutConfigCallback() {
            await saveLayoutConfigThrottler.doAction();
        }

        const projects = isPrivateMode
            ? await listProjects({})
            : {
                projects: [
                    {
                        type: "4f1b68c1-0760-4ea4-acf3-555f0475828c",
                        friendlyName: "Main",
                        identifier: "a"
                    },
                    {
                        type: "4f1b68c1-0760-4ea4-acf3-555f0475828c",
                        friendlyName: "Scratchpad",
                        identifier: "b"
                    },
                ]
            };

        await settingsPanelAttachJs(sessionConfig);
        aboutSectionAttachJs(sessionConfig);
        for (const tabControl of document.getElementsByClassName("project-inputs-tabs")) {
            const [addTab] = tabControlDynamicJs(tabControl);
            for (const project of projects.projects) {
                const childEl = makeElement({
                    tagName: "div",
                    classes: ["project-input"],
                    andAlso: (childControl) => {
                        projectInputAttachJs(childControl);
                    }
                });
                await addTab(
                    project.friendlyName,
                    project.identifier,
                    childEl,
                    project.friendlyName === "Main",
                    async (identifier) => {
                        if (isPrivateMode) {
                            await switchToProject({projectId: identifier});
                        }
                    });
            }
        }
        for (const tabControl of document.getElementsByClassName("main-tabs")) {
            tabControlAttachJs(tabControl);
        }
        projectWindowAttachJs();
        const dataSources = await dataSourceLookup.listDataSources();
        const dataSourceGridLoadPromise = dataSourceGridAttachJs(dataLayouts, dataSources, saveLayoutConfigCallback);
        await japaneseInputAttachJs(wordInfoLookup, refreshCurrentDataSources, similarCharactersRefresh);
        kanaBoardAttachJs(document.getElementsByClassName("kana-board-hiragana")[0] as HTMLDivElement, kana.hiragana, insertText);
        kanaBoardAttachJs(document.getElementsByClassName("kana-board-katakana")[0] as HTMLDivElement, kana.katakana, insertText);
        const radicalControlLoadPromise = radicalControlAttachJs(radicalLookup, insertText);
        await dataSourceGridLoadPromise;
        await radicalControlLoadPromise;

        const loadedElements = document.getElementsByClassName("loaded-content");
        for (const loadedElement of loadedElements) {
            loadedElement.classList.remove("loaded-content")
        }
        const loadingElements = document.getElementsByClassName("loading-screen");
        for (const loadingElement of loadingElements) {
            loadingElement.classList.remove("loading-screen")
            loadingElement.classList.add("loading-screen-loaded")
        }
    } catch (e) {
        const loadingElements = document.getElementsByClassName("loading-screen");
        for (const loadingElement of loadingElements) {
            removeAllChildElements(loadingElement);
            loadingElement.appendChild(makeElement({
                tagName: "div",
                classes: ["loading-error"],
                innerText: e
            }))
        }
    }
});

