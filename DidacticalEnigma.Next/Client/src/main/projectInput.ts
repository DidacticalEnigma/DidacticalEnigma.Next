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
            classes: ["project-input-center-panel"],
            elements: [
                makeElement({
                    tagName: "div",
                    classes: ["similar-characters-picker"],
                    andAlso: (element) => {
                        addPadding(element);
                    }
                }),
                makeElement({
                    tagName: "div",
                    classes: ["project-input-center-panel-footer"],
                    elements: [
                        makeElement({
                            tagName: "button",
                            innerText: "Previous"
                        }),
                        makeElement({
                            tagName: "button",
                            innerText: "Next"
                        })
                    ]
                })
            ]
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
                    tagName: "div",
                    classes: ["highlighter"]
                })
            ]
        }));
    }
}

function addPadding(charactersPickerElement: Element) {
    // add a few dummy buttons for consistent padding
    for(let i = 0; i < 3; ++i) {
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
    addPadding(charactersPickerElement);
}