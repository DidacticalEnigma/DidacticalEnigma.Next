import {makeElement, removeAllChildElements} from "./utility";
import {WordInfoResponse} from "../api/src";

const columnCount = 3;

export function projectInputAttachJs(element: Element) {
    const projectInputElement = element as HTMLDivElement;
    projectInputElement.appendChild(makeElement({
        tagName: "div",
        classes: ["japanese-input"]
    }));
    projectInputElement.appendChild(makeElement({
        tagName: "div",
        classes: ["project-input-center-panel"],
        children: [
            makeElement({
                tagName: "div",
                classes: ["similar-characters-picker"],
                andAlso: (element) => {
                    addPadding(element, columnCount);
                }
            }),
            makeElement({
                tagName: "div",
                classes: ["project-input-center-panel-footer"],
                children: [
                    makeElement({
                        tagName: "button",
                        children: [
                            makeElement({
                                tagName: "i",
                                classes: ["fas", "fa-arrow-left"]
                            })
                        ]
                    }),
                    makeElement({
                        tagName: "button",
                        children: [
                            makeElement({
                                tagName: "i",
                                classes: ["fas", "fa-arrow-right"]
                            })
                        ]
                    })
                ]
            })
        ]
    }));
    projectInputElement.appendChild(makeElement({
        tagName: "div",
        classes: ["english-input"],
        children: [
            makeElement({
                tagName: "textarea",
                classes: ["editor"],
                attributes: [["placeholder", " English"]]
            }),
            makeElement({
                tagName: "div",
                classes: ["highlighter"]
            })
        ]
    }));
}

function addPadding(charactersPickerElement: Element, count: number) {
    // add a few dummy buttons for consistent padding
    for(let i = 0; i < count; ++i) {
        charactersPickerElement.appendChild(makeElement({
            tagName: "button",
            innerText: "や",
            andAlso: (element) => {
                element.style.color = "transparent";
                element.style.backgroundColor = "transparent";
                element.style.borderColor = "transparent";
            }
        }))
    }
}

export function updateSimilarCharactersPicker(
    charactersPickerElement: Element,
    selectedText: string,
    wordInfoResponse: WordInfoResponse,
    onSimilarCharacterClick: (text: string) => Promise<void>) {
    removeAllChildElements(charactersPickerElement);
    const letter = selectedText.substring(0, 1);
    const similarLetters = wordInfoResponse.similarLetters[letter] ?? [];
    for (const similarCharacter of similarLetters) {
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
    
    addPadding(charactersPickerElement, columnCount - Math.min(columnCount, similarLetters.length));
}