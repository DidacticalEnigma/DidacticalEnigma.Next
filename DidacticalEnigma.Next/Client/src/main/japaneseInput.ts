import { findFirstParentWithClass } from "./utility";


export async function japaneseInputAttachJs(onchange: (text: string, position: number, positionEnd?: number) => Promise<void>) {
    for(const element of document.getElementsByClassName("japanese-input")) {
        const japaneseInput = element as HTMLElement;
        japaneseInput.setAttribute("contenteditable", "");
        japaneseInput.addEventListener("input", (_) => {
            
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