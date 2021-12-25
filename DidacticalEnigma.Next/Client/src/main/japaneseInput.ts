import {findFirstParentWithClass} from "./utility";
import {WordInfoLookup} from "./wordInfoLookup";
//import {KnownWordInfoType, WordInfoType} from "../api/src";

/*function mapWordTypeToClassList(type: WordInfoType) {
    switch (type) {
        case KnownWordInfoType.Verb:
            return ["verb-highlight"]
        case KnownWordInfoType.Noun:
            return ["noun-highlight"]
        case KnownWordInfoType.Particle:
            return ["particle-highlight"]
        default:
            return [];
    }
}*/

export async function japaneseInputAttachJs(_: WordInfoLookup, onchange: (text: string, position: number, positionEnd?: number) => Promise<void>) {
    for(const element of document.getElementsByClassName("japanese-input")) {
        const japaneseInput = element as HTMLElement;
        japaneseInput.setAttribute("spellcheck", "false")
        japaneseInput.setAttribute("contenteditable", "");
        japaneseInput.addEventListener("input", async (_) => {
            /*const words = await wordInfoLookup.getWordInfo(japaneseInput.innerText);
            removeAllChildElements(japaneseInput);
            japaneseInput.innerText = "";
            for (const word of words) {
                japaneseInput.appendChild(makeElement({
                    tagName: "span",
                    classes: mapWordTypeToClassList(word.type),
                    innerText: word.text
                }))
            }*/
        });
    }

    document.addEventListener("selectionchange", (_) => {
        const sel = document.getSelection();
        if(sel) {
            console.log(sel);
            const japaneseInput = findFirstParentWithClass(sel.anchorNode, "japanese-input");
            if(!japaneseInput) {
                return;
            }
            const text = japaneseInput.innerText;
            if(text.length === 0) {
                return;
            }

            const lastPositionStr = japaneseInput.getAttribute("data-last-position");
            const lastPosition = lastPositionStr ? parseInt(lastPositionStr, 10) : null;
            const lastPositionEndStr = japaneseInput.getAttribute("data-last-position-end");
            const lastPositionEnd = lastPositionEndStr ? parseInt(lastPositionEndStr, 10) : null;

            if(lastPosition === sel.anchorOffset || lastPositionEnd === sel.focusOffset) {
                return;
            } else {
                japaneseInput.setAttribute("data-last-position", sel.anchorOffset.toString());
                japaneseInput.setAttribute("data-last-position-end", sel.focusOffset.toString());
                onchange(japaneseInput.innerText, sel.anchorOffset, sel.focusOffset);
            }
        }
    });
}