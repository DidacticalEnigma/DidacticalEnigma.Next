import {DataSourceLookup} from "./dataSourceLookup";
import {map, filter} from "lodash";
import {notNull, makeElement, findFirstParentWithClass, zipShortest} from "./utility";
import {generateHtmlFromRichFormatting} from "./richFormatting"
import {ListDataSourcesResponse} from "../api/src";
import {LayoutConfig} from "./layoutConfig";

export async function dataSourceGridAttachJs(
    layouts: any[],
    dataSources: ListDataSourcesResponse,
    onLayoutChangeCallback: () => Promise<void>) {
    const dataSourceElements = document.getElementsByClassName("data-sources");

    const config = new DataSourceLayoutConfig(dataSources, onLayoutChangeCallback);

    for (const [dataSourceElement, rawLayout] of zipShortest(dataSourceElements, layouts)) {
        const tree = config.makeTree(rawLayout);
        dataSourceElement.appendChild(tree);
    }
}

export class DataSourceLayoutConfig extends LayoutConfig<HTMLElement, HTMLElement> {
    private _dataSources: ListDataSourcesResponse;
    private _onLayoutChangeCallback: () => Promise<void>;

    constructor(
        dataSources: ListDataSourcesResponse,
        onLayoutChangeCallback: () => Promise<void>) {
        super();
        this._dataSources = dataSources;
        this._onLayoutChangeCallback = onLayoutChangeCallback;
    }

    protected makeHSplit(left: HTMLElement, right: HTMLElement, ratio: number): HTMLElement {
        return makeSplit(left, right, "horizontal", ratio, this._onLayoutChangeCallback);
    }

    protected makeLeaf(identifier: string): HTMLElement {
        return createViewer(this._dataSources, identifier, this._onLayoutChangeCallback);
    }

    protected makeRoot(tree: HTMLElement): HTMLElement {
        return tree;
    }

    protected makeVSplit(top: HTMLElement, bottom: HTMLElement, ratio: number): HTMLElement {
        return makeSplit(top, bottom, "vertical", ratio, this._onLayoutChangeCallback);
    }

    private getRatio(widthOrHeight: string): number {
        return parseFloat(widthOrHeight.replace("%", ""));
    }

    private getType(node: HTMLDivElement): "vsplit" | "hsplit" | "leaf" {
        if (node.classList.contains("data-source-viewer")) {
            return "leaf";
        }
        if (node.classList.contains("data-source-vsplit")) {
            return "vsplit";
        }
        if (node.classList.contains("data-source-hsplit")) {
            return "hsplit";
        }

        throw "FUCK";
    }

    protected serializeVisitHSplit(node: HTMLElement): { left: HTMLElement; leftType: "vsplit" | "hsplit" | "leaf"; right: HTMLElement; rightType: "vsplit" | "hsplit" | "leaf"; ratio: number } {
        const children = filter(node.children, (child) =>
            child.classList.contains("data-source-viewer") ||
            child.classList.contains("data-source-vsplit") ||
            child.classList.contains("data-source-hsplit"));

        const leftChild = children[0] as HTMLDivElement;
        const rightChild = children[1] as HTMLDivElement;

        return {
            left: leftChild,
            right: rightChild,
            ratio: this.getRatio(leftChild.style.height),
            leftType: this.getType(leftChild),
            rightType: this.getType(rightChild)
        }
    }

    protected serializeVisitLeaf(node: HTMLElement): { identifier: string } {
        const selectElement = node.querySelector(".data-source-viewer-header-selector") as HTMLSelectElement;
        const option = selectElement.options[selectElement.selectedIndex !== -1 ? selectElement.selectedIndex : 0];
        return {
            identifier: option.value
        };
    }

    protected serializeVisitRoot(root: HTMLElement): { tree: HTMLElement; treeType: "vsplit" | "hsplit" | "leaf" } {
        for (const child of root.children) {
            if (child.classList.contains("data-source-viewer")) {
                return {
                    tree: child as HTMLElement,
                    treeType: "leaf"
                };
            }
            if (child.classList.contains("data-source-vsplit")) {
                return {
                    tree: child as HTMLElement,
                    treeType: "vsplit"
                };
            }
            if (child.classList.contains("data-source-hsplit")) {
                return {
                    tree: child as HTMLElement,
                    treeType: "hsplit"
                };
            }
        }

        throw "FUCK";
    }

    protected serializeVisitVSplit(node: HTMLElement): { top: HTMLElement; topType: "vsplit" | "hsplit" | "leaf"; bottom: HTMLElement; bottomType: "vsplit" | "hsplit" | "leaf"; ratio: number } {
        const children = filter(node.children, (child) =>
            child.classList.contains("data-source-viewer") ||
            child.classList.contains("data-source-vsplit") ||
            child.classList.contains("data-source-hsplit"));

        const topChild = children[0] as HTMLDivElement;
        const bottomChild = children[1] as HTMLDivElement;

        return {
            top: topChild,
            bottom: bottomChild,
            ratio: this.getRatio(topChild.style.width),
            topType: this.getType(topChild),
            bottomType: this.getType(bottomChild)
        }
    }
}

function createViewer(
    dataSources: ListDataSourcesResponse,
    identifier: string | undefined,
    onLayoutChangeCallback: () => Promise<void>) {
    return makeElement({
        tagName: "div",
        classes: ["data-source-viewer"],
        children: [
            makeElement({
                tagName: "div",
                classes: ["data-source-viewer-header"],
                children: [
                    makeElement({
                        tagName: "button",
                        children: [
                            makeElement({
                                tagName: "i",
                                classes: ["fas", "fa-columns"]
                            })
                        ],
                        classes: ["data-source-viewer-header-button"],
                        andAlso: (element) => {
                            element.addEventListener("click", () => {
                                createSplit(
                                    dataSources,
                                    findFirstParentWithClass(element, "data-source-viewer")!,
                                    "vertical",
                                    onLayoutChangeCallback);
                            })
                        }
                    }),
                    makeElement({
                        tagName: "button",
                        children: [
                            makeElement({
                                tagName: "i",
                                classes: ["fas", "fa-columns", "fa-rotate-90"]
                            })
                        ],
                        classes: ["data-source-viewer-header-button"],
                        andAlso: (element) => {
                            element.addEventListener("click", () => {
                                createSplit(
                                    dataSources,
                                    findFirstParentWithClass(element, "data-source-viewer")!,
                                    "horizontal",
                                    onLayoutChangeCallback);
                            })
                        }
                    }),
                    makeElement({
                        tagName: "div",
                        classes: ["select"],
                        children: [
                            makeElement({
                                tagName: "select",
                                classes: ["data-source-viewer-header-selector"],
                                children: map(dataSources, (dataSource) => {
                                    const attributes: [[string, string]] = [["value", dataSource.identifier]];
                                    if (dataSource.identifier == identifier) {
                                        attributes.push(["selected", "selected"]);
                                    }

                                    return makeElement({
                                        tagName: "option",
                                        attributes: attributes,
                                        innerText: dataSource.friendlyName
                                    });
                                }),
                                andAlso: (element) => {
                                    element.addEventListener("change", async () => {
                                        await onLayoutChangeCallback();
                                    });
                                }
                            })
                        ]
                    }),
                    makeElement({
                        tagName: "button",
                        children: [
                            makeElement({
                                tagName: "i",
                                classes: ["fas", "fa-times"]
                            })
                        ],
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

function makeSplit(
    firstChild: HTMLElement,
    secondChild: HTMLElement,
    type: "horizontal" | "vertical",
    ratio: number | undefined,
    onLayoutChangeCallback: () => Promise<void>): HTMLElement {
    const typeSuffix = function () {
        if (type == "horizontal") {
            return "hsplit";
        }
        if (type == "vertical") {
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
            const mouseMoveHandler = (ev: MouseEvent) => {
                const dx = ev.clientX - x;
                const dy = ev.clientY - y;

                const previous = element.previousElementSibling as HTMLElement;
                const next = element.nextElementSibling as HTMLElement;
                const parent = element.parentElement as HTMLElement;

                if (type == "vertical") {
                    const newLeftWidth = ((length + dx) * 100) / parent.getBoundingClientRect().width;
                    previous.style.width = `${newLeftWidth}%`;
                    next.style.width = `${100 - newLeftWidth}%`;
                    document.body.style.cursor = 'col-resize';
                } else {
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
            const mouseUpHandler = async (_: MouseEvent) => {
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

                await onLayoutChangeCallback();
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

    if (type == "horizontal") {
        firstChild.style.width = "100%";
        firstChild.style.height = firstRatioString;
        secondChild.style.width = "100%";
        secondChild.style.height = secondRatioString;
    }
    if (type == "vertical") {
        firstChild.style.width = firstRatioString;
        firstChild.style.height = "100%";
        secondChild.style.width = secondRatioString;
        secondChild.style.height = "100%";
    }

    return split;
}

function createSplit(
    dataSources: ListDataSourcesResponse,
    dataSourceViewer: HTMLElement,
    type: "horizontal" | "vertical",
    onLayoutChangeCallback: () => Promise<void>) {
    const parent = dataSourceViewer.parentElement;
    if (parent == null) {
        throw "Should not be a root node";
    }
    if (parent.classList.contains("data-sources") ||
        parent.classList.contains("data-source-vsplit") ||
        parent.classList.contains("data-source-hsplit")) {
        const dummy = document.createElement("div");
        dataSourceViewer.replaceWith(dummy);

        const newWidth = dataSourceViewer.style.width;
        const newHeight = dataSourceViewer.style.height;
        const one = dataSourceViewer;
        const two = createViewer(dataSources, undefined, onLayoutChangeCallback);
        const split = makeSplit(one, two, type, undefined, onLayoutChangeCallback);
        split.style.width = newWidth;
        split.style.height = newHeight;
        dummy.replaceWith(split);
    }
}

function closeSplit(dataSourceViewer: HTMLElement) {
    const parent = dataSourceViewer.parentElement;
    if (parent == null) {
        throw "Should not be a root node";
    }
    if (parent.classList.contains("data-sources")) {
        return;
    }
    if (parent.classList.contains("data-source-vsplit") ||
        parent.classList.contains("data-source-hsplit")) {
        dataSourceViewer.remove();
        for (const child of parent.children) {
            if (child.classList.contains("data-source-vsplit") ||
                child.classList.contains("data-source-hsplit") ||
                child.classList.contains("data-source-viewer")) {
                if (child instanceof HTMLElement) {
                    child.style.width = parent.style.width;
                    child.style.height = parent.style.height;

                    parent.replaceWith(child);
                    break;
                }
            }
        }
    }
}

export async function dataSourceGridLookup(dataSourceGrid: Element, dataSourceLookup: DataSourceLookup, text: string, position: number, positionEnd: number | undefined) {
    const viewers = dataSourceGrid.getElementsByClassName("data-source-viewer");
    const dataSourceIdentifiers = filter(
        map(viewers, (viewer) => (viewer.getElementsByTagName("select")[0]).selectedOptions[0].value),
        notNull);

    const dataSourceMapping = new Map<string, [Element]>();
    for (const viewer of viewers) {
        const identifier = (viewer.getElementsByTagName("select")[0]).selectedOptions[0].value;
        const value = dataSourceMapping.get(identifier);
        if (value === undefined) {
            dataSourceMapping.set(identifier, [viewer]);
        } else {
            value.push(viewer);
        }
    }

    const resultsTasks = dataSourceLookup.lookup(text, position, positionEnd, dataSourceIdentifiers);
    for (const resultsTask of resultsTasks) {
        for (const [identifier, response] of await resultsTask) {
            const viewers = dataSourceMapping.get(identifier) ?? [];
            for (const viewer of viewers) {
                const dataIdentifier = (viewer.getElementsByTagName("select")[0]).selectedOptions[0].value;
                if (dataIdentifier == null) {
                    continue;
                }

                for (const dataSourceText of viewer.getElementsByClassName("data-source-text")) {
                    dataSourceText.remove();
                }

                let content = response.context;
                if (content) {
                    const el = generateHtmlFromRichFormatting(content);
                    el.classList.add("data-source-text");
                    viewer.appendChild(el);
                } else {
                    viewer.appendChild(makeElement({
                        tagName: "div",
                        classes: ["data-source-text"],
                        innerText: response.error ?? ""
                    }));
                }
            }
        }
    }
}