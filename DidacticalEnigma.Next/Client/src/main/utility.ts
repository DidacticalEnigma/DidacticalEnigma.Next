import { zip } from "lodash"

export function removeAllChildElements(el: Element) {
    while (el.lastElementChild) {
        el.removeChild(el.lastElementChild);
    }
}

export function assertNonNull<T>(value: T | null) : T {
    if(value == null) {
        throw "WAS NULL";
    }
    return value;
}

export function* zipShortest<T1, T2>(sequence1: ArrayLike<T1>, sequence2: ArrayLike<T2>) {
    for(const [element1, element2] of zip(sequence1, sequence2)) {
        if(element1 === undefined || element2 === undefined) {
            return;
        }
        yield [element1, element2];
    }
}

export function notNull<TValue>(value: TValue | null): value is TValue {
    return value !== null;
}

export function makeElement<K extends keyof HTMLElementTagNameMap>(elementDescription: {tagName: K, attributes?: Iterable<[string, string]>, classes?: Iterable<string>, children?: Iterable<Node>, innerText?: string, andAlso?: (element: HTMLElementTagNameMap[K]) => void}): HTMLElementTagNameMap[K];
export function makeElement(elementDescription: {tagName: string, attributes?: Iterable<[string, string]>, classes?: Iterable<string>, children?: Iterable<Node>, innerText?: string, andAlso?: (element: HTMLElement) => void}) {
    const element = document.createElement(elementDescription.tagName);

    if(elementDescription.classes) {
        for(const c of elementDescription.classes) {
            element.classList.add(c);
        }
    }

    if(elementDescription.attributes) {
        for(const attrKvp of elementDescription.attributes) {
            element.setAttribute(attrKvp[0], attrKvp[1]);
        }
    }

    if(elementDescription.children) {
        for(const el of elementDescription.children) {
            element.append(el);
        }
    }

    if(elementDescription.innerText !== undefined) {
        element.innerText = elementDescription.innerText;
    }

    if(elementDescription.andAlso !== undefined) {
        elementDescription.andAlso(element);
    }

    return element;
}

export function withAlso<T>(value : T, fun: (value: T) => void) {
    fun(value);
    return value;
}

export function findFirstParentWithClass(element: Node | null, className: string) {
    if(!element) {
        return null;
    }

    let current = element.parentElement;
    while(current)
    {
        if(current.classList.contains(className))
        {
            return current;
        }
        else
        {
            current = current.parentElement;
        }
    }

    return current;
}

export function promiseDelay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function awaitAnySelect<T>(
    iterable: [PromiseLike<T>]): Promise<T>
{
    return Promise.all(
        iterable.map(promise => {
            return new Promise((resolve, reject) =>
                Promise.resolve(promise).then(reject, resolve)
            );
        })
    ).then(
        errors => Promise.reject(errors),
        value => Promise.resolve<T>(value)
    );
}

export function tuple<T extends any[]> (...items: T): T {
    return items;
}