import { DidacticalEnigmaNext } from "../api/src/didacticalEnigmaNext";

const url = new URL(window.location.href);

export const api : DidacticalEnigmaNext = new DidacticalEnigmaNext(
    url.origin,{
        allowInsecureConnection: true
    });