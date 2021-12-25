import {api} from "./api";
import { flatten } from "lodash"

export class WordInfoLookup {
    public async getWordInfo(text: string) {
        const result = await api.getWordInformation({
            fullText: text
        });
        return flatten(result.wordInformation);
    }
}