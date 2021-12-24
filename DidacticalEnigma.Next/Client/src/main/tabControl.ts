import { zipShortest } from "./utility";

export function tabControlAttachJs() {
    for (const tabControl of document.getElementsByClassName("tabcontrol")) {
        const tabs = tabControl.getElementsByClassName("tabcontrol-tab");
        const tabContents = tabControl.getElementsByClassName("tabcontrol-tabcontent");

        for (const [tab, tabContent] of zipShortest(tabs, tabContents)) {
            const button = document.createElement("button");

            button.addEventListener("click", function () {
                const currentlySelected = tabControl.getElementsByClassName("tabcontrol-tabcontent-selected")[0];
                currentlySelected.classList.remove("tabcontrol-tabcontent-selected");

                tabContent.classList.add("tabcontrol-tabcontent-selected");
            });

            const tabName = tab.getAttribute("data-tabname");
            if(tabName) {
                button.innerText = tabName;
                tab.appendChild(button);
            }
        }
    }
}