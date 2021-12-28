import { DataSourceLookup } from "./dataSourceLookup";
import { map, filter } from "lodash";
import {notNull, makeElement, findFirstParentWithClass, zipShortest} from "./utility";
import { generateHtmlFromRichFormatting } from "./richFormatting"
import {ListDataSourcesResponse} from "../api/src";
import { Config } from "./config";

export async function dataSourceGridAttachJs(layouts: any[], dataSourceLookup: DataSourceLookup) {
    const dataSources = await dataSourceLookup.listDataSources();

    const dataSourceElements = document.getElementsByClassName("data-sources");

    for(const [dataSourceElement, rawLayout] of zipShortest(dataSourceElements, layouts)) {
        const config = new Config(rawLayout);
        const tree = config.makeTree<HTMLElement, HTMLElement>(
            (root) => root,
            (left, right, ratio) => makeSplit(left, right, "vertical", ratio),
            (left, right, ratio) => makeSplit(left, right, "horizontal", ratio),
            (identifier) => createViewer(dataSources, identifier)
        )
        dataSourceElement.appendChild(tree);
    }
}

function createViewer(dataSources: ListDataSourcesResponse, identifier? : string) {
    return makeElement({
        tagName: "div",
        classes: ["data-source-viewer"],
        elements: [
            makeElement({
                tagName: "div",
                classes: ["data-source-viewer-header"],
                elements: [
                    makeElement({
                        tagName: "button",
                        innerText: "V",
                        classes: ["data-source-viewer-header-button"],
                        andAlso: (element) => {
                            element.addEventListener("click", () => {
                                createSplit(
                                    dataSources,
                                    findFirstParentWithClass(element, "data-source-viewer")!,
                                    "vertical");
                            })
                        }
                    }),
                    makeElement({
                        tagName: "button",
                        innerText: "H",
                        classes: ["data-source-viewer-header-button"],
                        andAlso: (element) => {
                            element.addEventListener("click", () => {
                                createSplit(
                                    dataSources,
                                    findFirstParentWithClass(element, "data-source-viewer")!,
                                    "horizontal");
                            })
                        }
                    }),
                    makeElement({
                        tagName: "div",
                        classes: ["select"],
                        elements: [
                            makeElement({
                                tagName: "select",
                                classes: ["data-source-viewer-header-selector"],
                                elements: map(dataSources, (dataSource) => {
                                    const attributes : [[string, string]] = [["value", dataSource.identifier]];
                                    if(dataSource.identifier == identifier) {
                                        attributes.push(["selected", "selected"]);
                                    }

                                    return makeElement({
                                        tagName: "option",
                                        attributes: attributes,
                                        innerText: dataSource.friendlyName
                                    });
                                })
                            })
                        ]
                    }),
                    makeElement({
                        tagName: "button",
                        innerText: "X",
                        classes: ["data-source-viewer-header-button"],
                        andAlso: (element) => {
                            element.addEventListener("click", () => {
                                closeSplit(findFirstParentWithClass(element, "data-source-viewer")!);
                            })
                        }
                    })
                ]
            }),
            makeElement({
                tagName: "div",
                classes: ["data-source-text"]
            })
        ]
    })
}

function makeSplit(firstChild: HTMLElement, secondChild: HTMLElement, type: "horizontal" | "vertical", ratio?: number): HTMLElement {
    const typeSuffix = function() {
        if(type == "horizontal") {
            return "hsplit";
        }
        if(type == "vertical") {
            return "vsplit";
        }
    }();
    const split = makeElement({
        tagName: "div",
        classes: ["data-source-" + typeSuffix]
    });
    const splitDragger = makeElement({
        tagName: "div",
        classes: ["data-source-split-dragger", "data-source-split-dragger-" + type],
        andAlso: (element) => {
            let x = 0;
            let y = 0;
            let length = 0;
            const mouseMoveHandler = (ev : MouseEvent) => {
                const dx = ev.clientX - x;
                const dy = ev.clientY - y;

                const previous = element.previousElementSibling as HTMLElement;
                const next = element.nextElementSibling as HTMLElement;
                const parent = element.parentElement as HTMLElement;
                
                if(type == "vertical") {
                    const newLeftWidth = ((length + dx) * 100) / parent.getBoundingClientRect().width;
                    previous.style.width = `${newLeftWidth}%`;
                    next.style.width = `${100 - newLeftWidth}%`;
                    document.body.style.cursor = 'col-resize';
                }
                else {
                    const newTopHeight = ((length + dy) * 100) / parent.getBoundingClientRect().height;
                    previous.style.height = `${newTopHeight}%`;
                    next.style.height = `${100 - newTopHeight}%`;
                    document.body.style.cursor = 'row-resize';
                }
                
                previous.style.userSelect = 'none';
                previous.style.pointerEvents = 'none';
            
                next.style.userSelect = 'none';
                next.style.pointerEvents = 'none';
            };
            const mouseUpHandler = (_ : MouseEvent) => {
                const previous = element.previousElementSibling as HTMLElement;
                const next = element.nextElementSibling as HTMLElement;

                element.style.removeProperty('cursor');
                document.body.style.removeProperty('cursor');
            
                previous.style.removeProperty('user-select');
                previous.style.removeProperty('pointer-events');
            
                next.style.removeProperty('user-select');
                next.style.removeProperty('pointer-events');

                document.removeEventListener("mousemove", mouseMoveHandler);
                document.removeEventListener("mouseup", mouseUpHandler);
            };
            element.addEventListener("mousedown", (ev) => {
                ev.preventDefault();
                
                x = ev.clientX;
                y = ev.clientY;
                const previous = element.previousElementSibling as HTMLElement;
                length = type == "vertical"
                    ? previous.getBoundingClientRect().width
                    : previous.getBoundingClientRect().height;
                
                document.addEventListener("mousemove", mouseMoveHandler);
                document.addEventListener("mouseup", mouseUpHandler);
            });
        }
    })
    split.appendChild(firstChild);
    split.appendChild(splitDragger);
    split.appendChild(secondChild);

    const firstRatioString = ratio ? `${ratio * 100}%` : "50%";
    const secondRatioString = ratio ? `${(1 - ratio) * 100}%` : "50%";

    if(type == "horizontal") {
        firstChild.style.width = "100%";
        firstChild.style.height = firstRatioString;
        secondChild.style.width = "100%";
        secondChild.style.height = secondRatioString;
    }
    if(type == "vertical") {
        firstChild.style.width = firstRatioString;
        firstChild.style.height = "100%";
        secondChild.style.width = secondRatioString;
        secondChild.style.height = "100%";
    }

    return split;
}

function createSplit(dataSources: ListDataSourcesResponse, dataSourceViewer: HTMLElement, type: "horizontal" | "vertical") {
    const parent = dataSourceViewer.parentElement;
    if(parent == null) {
        throw "Should not be a root node";
    }
    if(parent.classList.contains("data-sources") ||
       parent.classList.contains("data-source-vsplit") ||
       parent.classList.contains("data-source-hsplit")) {
        const dummy = document.createElement("div");
        dataSourceViewer.replaceWith(dummy);
        
        const newWidth = dataSourceViewer.style.width;
        const newHeight = dataSourceViewer.style.height;
        const one = dataSourceViewer;
        const two = createViewer(dataSources);
        const split = makeSplit(one, two, type);
        split.style.width = newWidth;
        split.style.height = newHeight;
        dummy.replaceWith(split);
    }
}

function closeSplit(dataSourceViewer: HTMLElement) {
    const parent = dataSourceViewer.parentElement;
    if(parent == null) {
        throw "Should not be a root node";
    }
    if(parent.classList.contains("data-sources")) {
        return;
    }
    if(parent.classList.contains("data-source-vsplit") ||
       parent.classList.contains("data-source-hsplit")) {
        dataSourceViewer.remove();
        for(const child of parent.children) {
            if(child.classList.contains("data-source-vsplit") ||
               child.classList.contains("data-source-hsplit") || 
               child.classList.contains("data-source-viewer")) {
                if(child instanceof HTMLElement) {
                    child.style.width = parent.style.width;
                    child.style.height = parent.style.height;

                    parent.replaceWith(child);
                    break;
                }
            }
        }
    }
}

export async function dataSourceGridLookup(dataSourceGrid: Element, dataSourceLookup: DataSourceLookup, text: string, position: number) {
    const viewers = dataSourceGrid.getElementsByClassName("data-source-viewer");
    const dataSourceIdentifiers = filter(
        map(viewers, (viewer) => (viewer.getElementsByTagName("select")[0]).selectedOptions[0].value),
        notNull);

    const result = await dataSourceLookup.lookup(text, position, dataSourceIdentifiers);

    for (const viewer of viewers) {
        const dataIdentifier = (viewer.getElementsByTagName("select")[0]).selectedOptions[0].value;
        if (dataIdentifier == null) {
            continue;
        }

        for(const dataSourceText of viewer.getElementsByClassName("data-source-text")) {
            dataSourceText.remove();
        }

        let content = result.get(dataIdentifier)?.context;
        if(content) {
            const el = generateHtmlFromRichFormatting(content);
            el.classList.add("data-source-text");
            viewer.appendChild(el);
        }
        else {
            viewer.appendChild(makeElement({
                tagName: "div",
                classes: ["data-source-text"],
                innerText: result.get(dataIdentifier)!.error ?? ""
            }));
        }
    }
}