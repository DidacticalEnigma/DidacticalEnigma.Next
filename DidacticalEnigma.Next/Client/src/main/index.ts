import { tabControlAttachJs } from "./tabControl";
import { RadicalLookup } from "./radicalLookup";
import { DataSourceLookup } from "./dataSourceLookup";
import { radicalControlAttachJs } from "./radicalControl";
import { dataSourceGridAttachJs, dataSourceGridLookup } from "./dataSourceGrid";
import { japaneseInputAttachJs } from "./japaneseInput";

window.addEventListener('load', async () => {
  const radicalLookup = new RadicalLookup();
  const dataSourceLookup = new DataSourceLookup();

  tabControlAttachJs();
  await radicalControlAttachJs(radicalLookup);
  await dataSourceGridAttachJs(dataSourceLookup);
  japaneseInputAttachJs(async (text, position, _) => {
    const dataSources = document.querySelector(".tabcontrol-tabcontent-selected .data-sources");
    if(dataSources) {
      await dataSourceGridLookup(dataSources, dataSourceLookup, text, position);
    }
  })
});