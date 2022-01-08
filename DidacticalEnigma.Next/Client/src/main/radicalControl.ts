import {makeElement, removeAllChildElements} from "./utility";
import { RadicalLookup } from "./radicalLookup";
import {join, map} from "lodash";
import { RadicalState } from "../api/src";

export async function radicalControlAttachJs(radicalLookup: RadicalLookup, callback: (text: string) => void) {
    const radicalsResult = await radicalLookup.getRadicals();

    for (const radicalRoot of document.getElementsByClassName("radicals")) {
        const radicalResetButton = radicalRoot.getElementsByClassName("radicals-reset-button")[0] as HTMLButtonElement;
        const radicalSelector = radicalRoot.getElementsByClassName("radicals-radicalselector")[0];
        const radicalSearchEditBox = radicalRoot.getElementsByClassName("radicals-searchbox")[0] as HTMLInputElement;
        const radicalSearchCriteriaSelect = radicalRoot.getElementsByClassName("radicals-sort-criteria")[0] as HTMLSelectElement;
        const hideRadicalCheckbox = radicalRoot.querySelector("input[type=checkbox]") as HTMLInputElement;

        radicalResetButton.addEventListener("click", async (_) => {
            await updateKanjiResults(radicalRoot, radicalLookup, "", undefined, hideRadicalCheckbox.checked, undefined, undefined, callback);
        });
        
        radicalSearchEditBox.addEventListener("keydown", async function(ev) {
            if (ev.key !== "Enter")
                return;
            
            const queryText = radicalSearchEditBox.value;
            await updateKanjiResults(radicalRoot, radicalLookup, queryText, undefined, hideRadicalCheckbox.checked, undefined, undefined, callback);
            return true;
        });

        for (const radicalCriterion of radicalsResult.sortingCriteria) {
            const option = document.createElement("option");
            option.value = radicalCriterion;
            option.innerText = radicalCriterion;
            radicalSearchCriteriaSelect.appendChild(option);
        }

        for (const radical of radicalsResult.radicalInformation) {
            radicalSelector.appendChild(makeElement({
                tagName: "button",
                classes: ["radicals-radicalselectoroption"],
                attributes: [["data-radical", radical.radical], ["title", join(radical.queryNames, "; ")]],
                innerText: radical.alternativeDisplay,
                andAlso: (element) => {
                    element.addEventListener("click", async function () {
                        let queryText = radicalSearchEditBox.value;
                        if (!element.classList.contains("radicals-radicalselected"))
                        {
                            await updateKanjiResults(radicalRoot, radicalLookup, queryText, radicalSearchCriteriaSelect.selectedOptions[0].value, hideRadicalCheckbox.checked, element.getAttribute("data-radical") ?? undefined, undefined, callback);
                        }
                        else
                        {
                            await updateKanjiResults(radicalRoot, radicalLookup, queryText, radicalSearchCriteriaSelect.selectedOptions[0].value, hideRadicalCheckbox.checked, undefined, element.getAttribute("data-radical") ?? undefined, callback);
                        }
                    })
                }
            }));
        }

        radicalSearchCriteriaSelect.addEventListener("change", async function(){
            await updateKanjiResults(
                radicalRoot,
                radicalLookup,
                radicalSearchEditBox.value,
                radicalSearchCriteriaSelect.selectedOptions[0].value,
                hideRadicalCheckbox.checked,
                undefined,
                undefined,
                callback);
        });

        hideRadicalCheckbox.addEventListener("change", async function(){
            await updateKanjiResults(
                radicalRoot,
                radicalLookup,
                radicalSearchEditBox.value,
                radicalSearchCriteriaSelect.selectedOptions[0].value,
                hideRadicalCheckbox.checked,
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
    hideNonMatchingComponents: boolean,
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
            radical.classList.remove("radicals-radicalselectoroption-hidden");
        }
        else {
            radical.setAttribute("disabled", "");
            if(hideNonMatchingComponents) {
                radical.classList.add("radicals-radicalselectoroption-hidden");
            }
            else {
                radical.classList.remove("radicals-radicalselectoroption-hidden");
            }
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