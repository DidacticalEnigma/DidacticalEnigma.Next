import {KanaBoard} from "../api/src";
import {makeElement} from "./utility";

export function kanaBoardAttachJs(kanaBoardElement: HTMLDivElement, kanaBoard: KanaBoard) {
    kanaBoardElement.style.gridTemplateColumns = `repeat(${kanaBoard.width}, 1fr)`;
    kanaBoardElement.style.gridTemplateRows = `repeat(${kanaBoard.height}, 1fr)`;
    for(const character of kanaBoard.characters) {
        kanaBoardElement.appendChild(makeElement({
            tagName: "button",
            innerText: character ? character.kana : " ",
            attributes: character ?  [["title", character.romaji ?? ""]] : []
        }));
    }
}