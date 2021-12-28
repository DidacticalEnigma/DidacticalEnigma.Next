import { tabControlAttachJs } from "./tabControl";
import { RadicalLookup } from "./radicalLookup";
import { DataSourceLookup } from "./dataSourceLookup";
import { radicalControlAttachJs } from "./radicalControl";
import { dataSourceGridAttachJs, dataSourceGridLookup } from "./dataSourceGrid";
import {japaneseInputAttachJs, japaneseInputInsertText, japaneseInputReplaceText} from "./japaneseInput";
import {WordInfoLookup} from "./wordInfoLookup";
import {projectWindowAttachJs} from "./projectWindow";
import {api, isPrivateMode} from "./api";
import {aboutSectionAttachJs} from "./aboutSection";
import {kanaBoardAttachJs} from "./kanaBoard";
import {projectInputAttachJs, updateSimilarCharactersPicker} from "./projectInput";
import {WordInfoResponse} from "../api/src";

window.addEventListener('load', async () => {
  const radicalLookup = new RadicalLookup();
  const dataSourceLookup = new DataSourceLookup();
  const wordInfoLookup = new WordInfoLookup();

  const kanaPromise = api.listKana();
  const sessionConfigPromise = api.loadSession();
  const sessionConfig = await sessionConfigPromise;
  const kana = await kanaPromise;
  
  let dataLayouts;
  
  if(sessionConfig.isDefault && !isPrivateMode) {
    const rawData = window.localStorage.getItem("configuration-layouts");
    if(rawData !== null) {
      dataLayouts = JSON.parse(rawData);
    }
    else {
      dataLayouts = sessionConfig.dataSourceGridLayouts;
    }
  }
  else {
    dataLayouts = sessionConfig.dataSourceGridLayouts;
  }

  async function replaceText(text: string) {
    await japaneseInputReplaceText(wordInfoLookup, text, similarCharactersRefresh);
  }

  async function similarCharactersRefresh(selectedText: string, wordInfoResponse: WordInfoResponse) {
    const charactersElement = document.querySelector(".tabcontrol-tabcontent-selected .similar-characters-picker");
    if(charactersElement) {
      updateSimilarCharactersPicker(charactersElement, selectedText, wordInfoResponse, replaceText);
    }
  }

  async function insertText(text: string) {
    await japaneseInputInsertText(wordInfoLookup, text, similarCharactersRefresh);
  }
  
  aboutSectionAttachJs(sessionConfig);
  projectInputAttachJs();
  tabControlAttachJs();
  projectWindowAttachJs();
  const dataSourceGridLoadPromise = dataSourceGridAttachJs(dataLayouts, dataSourceLookup);
  await japaneseInputAttachJs(wordInfoLookup, async (text, position, positionEnd) => {
    const result = await wordInfoLookup.getWordInfo(text);
    const charactersRefreshPromise = similarCharactersRefresh(text.substring(position,
        position == positionEnd
            ? position + 1
            : positionEnd
    ), result);
    const dataSources = document.querySelector(".tabcontrol-tabcontent-selected .data-sources");
    if(dataSources) {
      await dataSourceGridLookup(dataSources, dataSourceLookup, text, position);
    }
    await charactersRefreshPromise;
  }, similarCharactersRefresh);
  kanaBoardAttachJs(document.getElementsByClassName("kana-board-hiragana")[0] as HTMLDivElement, kana.hiragana, insertText);
  kanaBoardAttachJs(document.getElementsByClassName("kana-board-katakana")[0] as HTMLDivElement, kana.katakana, insertText);
  const radicalControlLoadPromise = radicalControlAttachJs(radicalLookup, insertText);
  await dataSourceGridLoadPromise;
  await radicalControlLoadPromise;
  
  const loadedElements = document.getElementsByClassName("loaded-content");
  for(const loadedElement of loadedElements) {
    loadedElement.classList.remove("loaded-content")
  }
  const loadingElements = document.getElementsByClassName("loading-screen");
  for (const loadingElement of loadingElements) {
    loadingElement.classList.remove("loading-screen")
    loadingElement.classList.add("loading-screen-loaded")
  }
});