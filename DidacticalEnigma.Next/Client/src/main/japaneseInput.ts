import {makeElement, promiseDelay, removeAllChildElements} from "./utility";
import {WordInfoLookup} from "./wordInfoLookup";
import {KnownWordInfoType, WordInfoResponse, WordInfoType} from "../api/src";
import {Throttler} from "./throttler";

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

export async function japaneseInputAttachJs(
    wordInfoLookup: WordInfoLookup,
    onchange: (text: string, position: number, positionEnd?: number) => Promise<void>,
    onWordInfoChange: (selectedText: string, result: WordInfoResponse) => Promise<void>) {
    
    for(const element of document.getElementsByClassName("japanese-input")) {
        const japaneseInput = element as HTMLElement;
        const textAreaElement = makeElement({
            tagName: "textarea",
            classes: ["editor"],
            attributes: [["spellcheck", "false"], ["placeholder", " Japanese"]],
        });
        const divElement = makeElement({
            tagName: "div",
            classes: ["highlighter"]
        });

        const updateThrottler = new Throttler(async () => {
            if(textAreaElement.value.length === 0) {
                return;
            }

            await onchange(textAreaElement.value, textAreaElement.selectionStart, textAreaElement.selectionEnd);
        }, 50);
        
        async function send() {
            await updateThrottler.doAction();
        }
        
        async function highlight() {
            await highlightJapaneseInput(wordInfoLookup, divElement, textAreaElement, onWordInfoChange);
        }
        
        function syncScroll() {
            synchronizeScroll(divElement, textAreaElement);
        }

        textAreaElement.addEventListener("mouseup", send);
        textAreaElement.addEventListener("select", send);
        textAreaElement.addEventListener("keyup", send);
        textAreaElement.addEventListener("input", highlight);
        textAreaElement.addEventListener("keyup", syncScroll);
        textAreaElement.addEventListener("scroll", syncScroll);
        
        japaneseInput.appendChild(textAreaElement);
        japaneseInput.appendChild(divElement);
    }
}

function synchronizeScroll(
    divElement: HTMLDivElement,
    textAreaElement: HTMLTextAreaElement) {
    divElement.scrollTop = textAreaElement.scrollTop;
    divElement.scrollLeft = textAreaElement.scrollLeft;
}

async function highlightJapaneseInput(
    wordInfoLookup: WordInfoLookup,
    divElement: HTMLDivElement,
    textAreaElement: HTMLTextAreaElement,
    onWordInfoChange: (selectedText: string, result: WordInfoResponse) => Promise<void>) {
    const lastHighlightId = parseInt(textAreaElement.getAttribute("last-highlight-id") ?? "0", 10);
    await promiseDelay(50);
    const currentHighlightId = parseInt(textAreaElement.getAttribute("last-highlight-id") ?? "0", 10);
    if(lastHighlightId !== currentHighlightId) {
        return;
    }
    removeAllChildElements(divElement);
    const newText = textAreaElement.value;
    divElement.innerText = newText;
    if(!textAreaElement.value) {
        return;
    }
    const result = await wordInfoLookup.getWordInfo(newText);
    const postQueryHighlightId = parseInt(textAreaElement.getAttribute("last-highlight-id") ?? "0", 10);
    if(postQueryHighlightId !== lastHighlightId) {
        return;
    }
    const selectedText = newText.substring(textAreaElement.selectionStart,
        textAreaElement.selectionStart == textAreaElement.selectionEnd
            ? textAreaElement.selectionStart + 1
            : textAreaElement.selectionEnd
    );
    await onWordInfoChange(selectedText, result);
    divElement.innerText = "";
    let index = 0;
    for (const word of result.wordInformation) {
        const newIndex = newText.indexOf(word.text, index);
        if(index !== newIndex) {
            divElement.appendChild(makeElement({
                tagName: "span",
                innerText: newText.substring(index, newIndex)
            }));
        }
        index = newIndex + word.text.length;
        divElement.appendChild(makeElement({
            tagName: "span",
            classes: mapWordTypeToClassList(word.type),
            attributes: [["title", word.reading]],
            innerText: word.text
        }));
    }
    textAreaElement.setAttribute("last-highlight-id", (postQueryHighlightId + 1).toString());
}

export async function japaneseInputResetText(
    wordInfoLookup: WordInfoLookup,
    text: string,
    onWordInfoChange: (selectedText: string, result: WordInfoResponse) => Promise<void>) {
    const editorElement = document.querySelector(".tabcontrol-tabcontent-selected .japanese-input .editor") as HTMLTextAreaElement;
    const highlightElement = document.querySelector(".tabcontrol-tabcontent-selected .japanese-input .highlighter") as HTMLDivElement;
    if (editorElement !== null) {
        editorElement.value = text;
        editorElement.selectionStart = 0;
        editorElement.selectionEnd = 0;
        await highlightJapaneseInput(wordInfoLookup, highlightElement, editorElement, onWordInfoChange);
    }
}

export async function japaneseInputInsertText(
    wordInfoLookup: WordInfoLookup,
    text: string,
    onWordInfoChange: (selectedText: string, result: WordInfoResponse) => Promise<void>) {
    const editorElement = document.querySelector(".tabcontrol-tabcontent-selected .japanese-input .editor") as HTMLTextAreaElement;
    const highlightElement = document.querySelector(".tabcontrol-tabcontent-selected .japanese-input .highlighter") as HTMLDivElement;
    if (editorElement !== null) {
        editorElement.value =
            editorElement.value.substr(0, editorElement.selectionStart)
            + text
            + editorElement.value.substr(editorElement.selectionEnd);
        const newCursorPosition = editorElement.selectionStart + text.length;
        editorElement.selectionStart = newCursorPosition;
        editorElement.selectionEnd = newCursorPosition;
        await highlightJapaneseInput(wordInfoLookup, highlightElement, editorElement, onWordInfoChange);
    }
}

export async function japaneseInputReplaceText(
    wordInfoLookup: WordInfoLookup,
    text: string,
    onWordInfoChange: (selectedText: string, result: WordInfoResponse) => Promise<void>) {
    const editorElement = document.querySelector(".tabcontrol-tabcontent-selected .japanese-input .editor") as HTMLTextAreaElement;
    const highlightElement = document.querySelector(".tabcontrol-tabcontent-selected .japanese-input .highlighter") as HTMLDivElement;
    if (editorElement !== null) {
        const offset = editorElement.selectionStart === editorElement.selectionEnd
            ? 1
            : 0;
        editorElement.value =
            editorElement.value.substr(0, editorElement.selectionStart)
            + text
            + editorElement.value.substr(editorElement.selectionEnd + offset);
        const newCursorPosition = editorElement.selectionStart;
        editorElement.selectionStart = newCursorPosition;
        editorElement.selectionEnd = newCursorPosition;
        await highlightJapaneseInput(wordInfoLookup, highlightElement, editorElement, onWordInfoChange);
    }
}