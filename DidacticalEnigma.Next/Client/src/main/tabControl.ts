import {makeElement, zipShortest} from "./utility";

async function selectTab(
    tabControl: Element,
    tabContent: Element,
    tab: Element,
    onSelect: ((identifier: string) => Promise<void>) | undefined,
    onDeselect: ((identifier: string) => Promise<void>) | undefined) {
    const currentlySelected = tabControl.getElementsByClassName("tabcontrol-tabcontent-selected")[0];
    if (currentlySelected) {
        const selectedTab = tabControl.getElementsByClassName("tabcontrol-tab-selected")[0];
        if (selectedTab) {
            if (onDeselect) {
                await onDeselect(selectedTab.getAttribute("data-identifier") ?? "")
            }
        }
    }

    if (onSelect) {
        await onSelect(tab.getAttribute("data-identifier") ?? "")
    }
    
    if (currentlySelected) {
        currentlySelected.classList.remove("tabcontrol-tabcontent-selected");
        const selectedTab = tabControl.getElementsByClassName("tabcontrol-tab-selected")[0];
        if (selectedTab) {
            selectedTab.classList.remove("tabcontrol-tab-selected");
        }
    }
    
    tab.classList.add("tabcontrol-tab-selected");
    tabContent.classList.add("tabcontrol-tabcontent-selected");
}

function tabAttachJs(
    tabControl: Element,
    tabContent: Element,
    tab: Element,
    onSelect?: (identifier: string) => Promise<void>,
    onDeselect?: (identifier: string) => Promise<void>) {
    const button = document.createElement("button");

    button.addEventListener("click", async function () {
        await selectTab(tabControl, tabContent, tab, onSelect, onDeselect);
    });

    const tabName = tab.getAttribute("data-tabname");
    if (tabName) {
        button.innerText = tabName;
        tab.appendChild(button);
    }
}

export function tabControlAttachJs(tabControl: Element) {
    const tabs = tabControl.getElementsByClassName("tabcontrol-tab");
    const tabContents = tabControl.getElementsByClassName("tabcontrol-tabcontent");

    for (const [tab, tabContent] of zipShortest(tabs, tabContents)) {
        tabAttachJs(tabControl, tabContent, tab);
    }
}

export function tabControlDynamicJs(element: Element) {
    element.classList.add("tabcontrol");
    const header = makeElement({
        tagName: "div",
        classes: ["tabcontrol-header"]
    });
    element.appendChild(header);
    async function addTab(
        tabName: string,
        identifier: string,
        tabContentChild: HTMLElement,
        select: boolean,
        onSelect?: (identifier: string) => Promise<void>,
        onDeselect?: (identifier: string) => Promise<void>) {
        const tab = makeElement({
            tagName: "div",
            classes: ["tabcontrol-tab"].concat(select ? ["tabcontrol-tab-selected"] : []),
            attributes: [["data-tabname", tabName], ["data-identifier", identifier]]
        });
        const tabContent = makeElement({
            tagName: "div",
            classes: ["tabcontrol-tabcontent"].concat(select ? ["tabcontrol-tabcontent-selected"] : []),
            children: [tabContentChild]
        }) 
        header.appendChild(tab);
        element.appendChild(tabContent);
        tabAttachJs(element, tabContent, tab, onSelect, onDeselect);
        if(select && onSelect) {
            await selectTab(element, tabContent, tab, onSelect, onDeselect);
        }
    }
    
    return [addTab];
}