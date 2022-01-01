import {promiseDelay} from "./utility";

export class Throttler
{
    private _action: () => Promise<void>;
    private _throttleTime: number;
    private _requestId: number;

    public constructor(action: () => Promise<void>, throttleTime: number) {
        this._action = action;
        this._throttleTime = throttleTime;
        this._requestId = 0;
    }

    public async doAction() {
        this._requestId++;
        const beforeThrottleRequestId = this._requestId;
        await promiseDelay(this._throttleTime);
        const afterThrottleRequestId = this._requestId;
        if(beforeThrottleRequestId !== afterThrottleRequestId) {
            return;
        }
        await this._action();
    }
}