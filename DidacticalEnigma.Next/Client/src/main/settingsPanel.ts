import {makeElement} from "./utility";
import {ProgramConfigurationGetResult} from "../api/src";

export function settingsPanelAttachJs(_: ProgramConfigurationGetResult) {
    const elements = document.getElementsByClassName("settings-panel");
    for(const element of elements) {
        const settingPanel = element as HTMLDivElement;
        settingPanel.appendChild(makeElement({
            tagName: "div",
            classes: ["settings-panel-didactical-enigma-mem"],
            children: [
                makeElement({
                    tagName: "label",
                    children: [
                        document.createTextNode("DidacticalEnigma.Mem URL:"),
                        makeElement({
                            tagName: "input",
                            attributes: [["type", "text"]]
                        })
                    ]
                }),
                makeElement({
                    tagName: "button",
                    innerText: "Set"
                }),
                makeElement({
                    tagName: "button",
                    innerText: "Reset"
                }),
                makeElement({
                    tagName: "button",
                    innerText: "Log in"
                }),
                makeElement({
                    tagName: "button",
                    innerText: "Log out"
                })
            ]
        }))
    }
}