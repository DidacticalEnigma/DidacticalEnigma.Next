import { tabControlAttachJs } from "./tabControl";
import { RadicalLookup } from "./radicalLookup";
import { DataSourceLookup } from "./dataSourceLookup";
import { radicalControlAttachJs } from "./radicalControl";
import { dataSourceGridAttachJs, dataSourceGridLookup } from "./dataSourceGrid";
import { japaneseInputAttachJs } from "./japaneseInput";
import {WordInfoLookup} from "./wordInfoLookup";
import {projectWindowAttachJs} from "./projectWindow";

window.addEventListener('load', async () => {
  const radicalLookup = new RadicalLookup();
  const dataSourceLookup = new DataSourceLookup();
  const wordInfoLookup = new WordInfoLookup();

  tabControlAttachJs();
  projectWindowAttachJs();
  const task1 = radicalControlAttachJs(radicalLookup);
  const task2 = dataSourceGridAttachJs(dataSourceLookup);
  await task1;
  await task2;
  await japaneseInputAttachJs(wordInfoLookup, async (text, position, _) => {
    const dataSources = document.querySelector(".tabcontrol-tabcontent-selected .data-sources");
    if(dataSources) {
      await dataSourceGridLookup(dataSources, dataSourceLookup, text, position);
    }
  })
});