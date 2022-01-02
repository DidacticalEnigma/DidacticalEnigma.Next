import {makeElement} from "./utility";
import {ProgramConfigurationGetResult} from "../api/src";

export async function settingsPanelAttachJs(_: ProgramConfigurationGetResult) {
    const elements = document.getElementsByClassName("settings-panel");
    for(const element of elements) {
        const settingPanel = element as HTMLDivElement;
        let intervalValue: NodeJS.Timer | null = null;
        let timeout: number = 0;
        const urlInput = makeElement({
            tagName: "input",
            attributes: [["type", "text"]],
            andAlso: (element) => {
                element.addEventListener("input", async (_) => {
                    const result = await didacticalEnigmaMemUpdateAddress({
                        url: element.value
                    })
                    refreshState(result);
                });
            }
        });
        const setButton = makeElement({
            tagName: "button",
            innerText: "Set",
            andAlso: (element) => {
                element.addEventListener("click", async (_) => {
                    const result = await didacticalEnigmaMemSet({})
                    refreshState(result);
                });
            }
        });
        const resetButton = makeElement({
            tagName: "button",
            innerText: "Reset",
            andAlso: (element) => {
                element.addEventListener("click", async (_) => {
                    const result = await didacticalEnigmaMemReset({})
                    refreshState(result);
                });
            }
        });
        const logInButton = makeElement({
            tagName: "button",
            innerText: "Log in",
            andAlso: (element) => {
                element.addEventListener("click", async (_) => {
                    const result = await didacticalEnigmaMemLogIn({});
                    refreshState(result);
                    intervalValue = setInterval(async () => {
                        refreshState(await didacticalEnigmaMemCheckState({}))
                        timeout += 400;
                    }, 400);
                });
            }
        });
        const logOutButton = makeElement({
            tagName: "button",
            innerText: "Log out",
            andAlso: (element) => {
                element.addEventListener("click", async (_) => {
                    const result = await didacticalEnigmaMemLogOut({})
                    refreshState(result);
                });
            }
        });
        const promptSpan = makeElement({
            tagName: "span",
            innerText: ""
        });
        const verificationLink = makeElement({
            tagName: "a",
            innerText: ""
        });
        const errorSpan = makeElement({
            tagName: "span",
            innerText: ""
        });
        settingPanel.appendChild(makeElement({
            tagName: "div",
            classes: ["settings-panel-didactical-enigma-mem"],
            children: [
                makeElement({
                    tagName: "label",
                    children: [
                        document.createTextNode("DidacticalEnigma.Mem URL:"),
                        urlInput
                    ]
                }),
                setButton,
                resetButton,
                logInButton,
                logOutButton,
                promptSpan,
                verificationLink,
                errorSpan
            ]
        }));
        
        refreshState(await didacticalEnigmaMemCheckState({}));
        
        function refreshState(status: DidacticalEnigmaMemConnectionStatusResult) {
            if(status.isNotSet) {
                urlInput.removeAttribute("disabled");
            }
            else {
                urlInput.setAttribute("disabled", "");
            }
            
            if(status.canSet) {
                setButton.removeAttribute("disabled");
            }
            else {
                setButton.setAttribute("disabled", "");
            }

            if(status.canReset) {
                resetButton.removeAttribute("disabled");
            }
            else {
                resetButton.setAttribute("disabled", "");
            }

            if(status.canLogIn) {
                logInButton.removeAttribute("disabled");
            }
            else {
                logInButton.setAttribute("disabled", "");
            }

            if(status.canLogOut) {
                logOutButton.removeAttribute("disabled");
            }
            else {
                logOutButton.setAttribute("disabled", "");
            }

            if(status.prompt) {
                promptSpan.innerText = status.prompt;
            }
            else {
                promptSpan.innerText = "";
            }

            if(status.verificationUri) {
                verificationLink.innerText = status.verificationUri;
                verificationLink.setAttribute("href", status.verificationUri);
            }
            else {
                verificationLink.innerText = "";
                verificationLink.removeAttribute("href");
            }

            if(status.error) {
                errorSpan.innerText = status.error;
            }
            else {
                errorSpan.innerText = "";
            }
            
            if(!status.isLoggingIn && intervalValue !== null && timeout >= 5000) {
                clearInterval(intervalValue);
                intervalValue = null;
                timeout = 0;
            }
        }
    }
}