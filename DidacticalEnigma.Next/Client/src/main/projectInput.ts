import {makeElement, removeAllChildElements} from "./utility";
import {WordInfoResponse} from "../api/src";

export function projectInputAttachJs() {
    const elements = document.getElementsByClassName("project-input");
    for (const element of elements) {
        const projectInputElement = element as HTMLDivElement;
        projectInputElement.appendChild(makeElement({
            tagName: "div",
            classes: ["japanese-input"]
        }));
        projectInputElement.appendChild(makeElement({
            tagName: "div",
            classes: ["similar-characters-picker"]
        }));
        projectInputElement.appendChild(makeElement({
            tagName: "div",
            classes: ["english-input"],
            elements: [
                makeElement({
                    tagName: "textarea",
                    classes: ["editor"]
                }),
                makeElement({
                    tagName: "textarea",
                    classes: ["highlighter"]
                })
            ]
        }));
    }
}

export function updateSimilarCharactersPicker(
    charactersPickerElement: Element,
    selectedText: string,
    wordInfoResponse: WordInfoResponse,
    onSimilarCharacterClick: (text: string) => Promise<void>) {
    removeAllChildElements(charactersPickerElement);
    if(selectedText.length === 0) {
        return;
    }
    const letter = selectedText.substring(0, 1);
    for (const similarCharacter of wordInfoResponse.similarLetters[letter]) {
        charactersPickerElement.appendChild(makeElement({
            tagName: "button",
            innerText: similarCharacter.letter,
            attributes: [["title", similarCharacter.description]],
            andAlso: (element) => {
                element.addEventListener("click", async (_) => {
                    await onSimilarCharacterClick(element.innerText);
                });
            }
        }))
    }
}