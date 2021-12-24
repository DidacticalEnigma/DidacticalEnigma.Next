import { DidacticalEnigmaRestApi } from "../api/src/didacticalEnigmaRestApi";

const url = new URL(window.location.href);

export const api : DidacticalEnigmaRestApi = new DidacticalEnigmaRestApi(
    url.origin,{
        allowInsecureConnection: true
    });