import { removeAllChildElements } from "./utility";
import { RadicalLookup } from "./radicalLookup";
import { map } from "lodash";
import { RadicalState } from "../api/src";

export async function radicalControlAttachJs(radicalLookup: RadicalLookup, callback: (text: string) => void) {
    const radicalsResult = await radicalLookup.getRadicals();

    for (const radicalRoot of document.getElementsByClassName("radicals")) {
        const radicalSelector = radicalRoot.getElementsByClassName("radicals-radicalselector")[0];
        const radicalSearchEditBox = radicalRoot.getElementsByClassName("radicals-searchbox")[0] as HTMLInputElement;
        const radicalSearchCriteriaSelect = radicalRoot.getElementsByClassName("radicals-sort-criteria")[0] as HTMLSelectElement;

        radicalSearchEditBox.addEventListener("keydown", async function(ev) {
            if (ev.key !== "Enter")
                return;
            
            const queryText = radicalSearchEditBox.value;
            await updateKanjiResults(radicalRoot, radicalLookup, queryText, undefined, undefined, undefined, callback);
            return true;
        });

        for (const radicalCriterion of radicalsResult.sortingCriteria) {
            const option = document.createElement("option");
            option.value = radicalCriterion;
            option.innerText = radicalCriterion;
            radicalSearchCriteriaSelect.appendChild(option);
        }

        for (const radical of radicalsResult.radicalInformation) {
            const button = document.createElement("button");
            button.setAttribute("class", "radicals-radicalselectoroption");
            button.innerText = radical.alternativeDisplay;
            button.setAttribute("data-radical", radical.radical);
            button.addEventListener("click", async function () {
                let queryText = radicalSearchEditBox.value;
                if (!button.classList.contains("radicals-radicalselected"))
                {
                    await updateKanjiResults(radicalRoot, radicalLookup, queryText, radicalSearchCriteriaSelect.selectedOptions[0].value, button.getAttribute("data-radical") ?? undefined, undefined, callback);
                }
                else
                {
                    await updateKanjiResults(radicalRoot, radicalLookup, queryText, radicalSearchCriteriaSelect.selectedOptions[0].value, undefined, button.getAttribute("data-radical") ?? undefined, callback);
                }
            });
            radicalSelector.appendChild(button);
        }

        radicalSearchCriteriaSelect.addEventListener("change", async function(){
            await updateKanjiResults(
                radicalRoot,
                radicalLookup,
                radicalSearchEditBox.value,
                radicalSearchCriteriaSelect.selectedOptions[0].value,
                undefined,
                undefined,
                callback);
        });
    }
}

async function updateKanjiResults(
    radicalRoot: Element,
    radicalLookup: RadicalLookup,
    queryText: string,
    sortCriterion: string | undefined,
    select: string | undefined,
    deselect: string | undefined,
    callback: (text: string) => void) {
    const result = await radicalLookup.selectRadicals(queryText, sortCriterion, select, deselect);

    const kanjiResultElementsRootDiv = radicalRoot.getElementsByClassName("radicals-kanjiresults")[0];
    const radicalSearchEditBox = radicalRoot.getElementsByClassName("radicals-searchbox")[0] as HTMLInputElement;
    
    removeAllChildElements(kanjiResultElementsRootDiv);
    for (const kanji of result.kanji) {
        const kanjiButton = document.createElement("button");
        kanjiButton.addEventListener("click", _ => {
            callback(kanji);
        })

        kanjiButton.setAttribute("class", "radicals-kanjiresult");
        kanjiButton.innerText = kanji;

        kanjiResultElementsRootDiv.appendChild(kanjiButton);
    }

    const radicals = new Map<string, RadicalState>(map(result.radicals, radical => [radical.radical, radical]));

    for (const radical of radicalRoot.getElementsByClassName("radicals-radicalselectoroption")) {
        const radicalText = radical.getAttribute("data-radical") ?? "";
        if (radicals.get(radicalText)?.isAvailable) {
            radical.removeAttribute("disabled");
        }
        else {
            radical.setAttribute("disabled", "");
        }

        if (radicals.get(radicalText)?.isSelected) {
            radical.classList.add("radicals-radicalselected");
        }
        else {
            radical.classList.remove("radicals-radicalselected");
        }
    }

    radicalSearchEditBox.value = result.newQuery;
}