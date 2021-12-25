import {ProgramConfigurationGetResult} from "../api/src";

export function aboutSectionAttachJs(sessionConfig: ProgramConfigurationGetResult) {
    for(const element of document.getElementsByClassName("about-section")) {
        const aboutSection = element as HTMLDivElement;
        aboutSection.innerText = `Didactical Enigma ${sessionConfig.version}\r\n\r\n${sessionConfig.aboutSection}`;
    }
}