import {isPrivateMode} from "./api";

export function projectWindowAttachJs() {
    for(const element of document.getElementsByClassName("project-window")) {
        const projectWindow = element as HTMLDivElement;
        if (!isPrivateMode) {
            projectWindow.innerText = "Disabled in public mode";
        } else {
            projectWindow.innerText = "Private mode enabled";
        }
    }
}