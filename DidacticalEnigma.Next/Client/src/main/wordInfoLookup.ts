import {api} from "./api";

export class WordInfoLookup {
    public async getWordInfo(text: string) {
        return await api.getWordInformation({
            fullText: text
        });
    }
}