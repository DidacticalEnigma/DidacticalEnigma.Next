import {makeElement, removeAllChildElements} from "./utility";
import {WordInfoLookup} from "./wordInfoLookup";
import {KnownWordInfoType, WordInfoType} from "../api/src";

function mapWordTypeToClassList(type: WordInfoType) {
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
}

export async function japaneseInputAttachJs(wordInfoLookup: WordInfoLookup, onchange: (text: string, position: number, positionEnd?: number) => Promise<void>) {
    for(const element of document.getElementsByClassName("japanese-input")) {
        const japaneseInput = element as HTMLElement;
        const textAreaElement = makeElement({
            tagName: "textarea",
            classes: ["editor"],
            attributes: [["spellcheck", "false"]],
        });
        const divElement = makeElement({
            tagName: "div",
            classes: ["highlighter"]
        });

        async function send() {
            if(textAreaElement.value.length === 0) {
                return;
            }

            await onchange(textAreaElement.value, textAreaElement.selectionStart, textAreaElement.selectionEnd);
        }
        
        async function highlight() {
            removeAllChildElements(divElement);
            divElement.innerText = textAreaElement.value;
            const result = await wordInfoLookup.getWordInfo(textAreaElement.value);
            divElement.innerText = "";
            for (const line of result) {
                for(const word of line) {
                    divElement.appendChild(makeElement({
                        tagName: "span",
                        classes: mapWordTypeToClassList(word.type),
                        innerText: word.text
                    }));
                }
                divElement.appendChild(makeElement({
                    tagName: "br"
                }));
            }
        }
        
        textAreaElement.addEventListener("click", send);
        textAreaElement.addEventListener("focus", send);
        textAreaElement.addEventListener("input", highlight);
        
        japaneseInput.appendChild(textAreaElement);
        japaneseInput.appendChild(divElement);
    }
}