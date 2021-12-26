import { tabControlAttachJs } from "./tabControl";
import { RadicalLookup } from "./radicalLookup";
import { DataSourceLookup } from "./dataSourceLookup";
import { radicalControlAttachJs } from "./radicalControl";
import { dataSourceGridAttachJs, dataSourceGridLookup } from "./dataSourceGrid";
import { japaneseInputAttachJs } from "./japaneseInput";
import {WordInfoLookup} from "./wordInfoLookup";
import {projectWindowAttachJs} from "./projectWindow";
import {api} from "./api";
import {aboutSectionAttachJs} from "./aboutSection";
import {kanaBoardAttachJs} from "./kanaBoard";

window.addEventListener('load', async () => {
  const radicalLookup = new RadicalLookup();
  const dataSourceLookup = new DataSourceLookup();
  const wordInfoLookup = new WordInfoLookup();

  const kanaPromise = api.listKana();
  const sessionConfigPromise = api.loadSession();
  const sessionConfig = await sessionConfigPromise;
  const kana = await kanaPromise;

  aboutSectionAttachJs(sessionConfig);
  tabControlAttachJs();
  projectWindowAttachJs();
  kanaBoardAttachJs(document.getElementsByClassName("kana-board-hiragana")[0] as HTMLDivElement, kana.hiragana!);
  kanaBoardAttachJs(document.getElementsByClassName("kana-board-katakana")[0] as HTMLDivElement, kana.katakana!);
  const task1 = radicalControlAttachJs(radicalLookup);
  const task2 = dataSourceGridAttachJs(sessionConfig, dataSourceLookup);
  await task1;
  await task2;
  await japaneseInputAttachJs(wordInfoLookup, async (text, position, _) => {
    const dataSources = document.querySelector(".tabcontrol-tabcontent-selected .data-sources");
    if(dataSources) {
      await dataSourceGridLookup(dataSources, dataSourceLookup, text, position);
    }
  })
});