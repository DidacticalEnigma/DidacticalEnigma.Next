import { DidacticalEnigmaNext } from "../api/src/didacticalEnigmaNext";

const url = new URL(window.location.href);

export const isPrivateMode = !!url.searchParams.get("privateMode");

function isLocalhost(url: URL) {
    // TODO: handle IPv6 localhost
    return url.hostname == "localhost" || url.hostname == "127.0.0.1";
}

export const api : DidacticalEnigmaNext = new DidacticalEnigmaNext(
    url.origin,{
        allowInsecureConnection: isLocalhost(url),
        retryOptions: {
            maxRetries: 2,
            maxRetryDelayInMs: 1000,
            retryDelayInMs: 200
        }
    });