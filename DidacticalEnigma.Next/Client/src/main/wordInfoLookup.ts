import {api} from "./api";

export class WordInfoLookup {
    public async getWordInfo(text: string) {
        const result = await api.getWordInformation({
            fullText: text
        });
        return result.wordInformation;
    }
}