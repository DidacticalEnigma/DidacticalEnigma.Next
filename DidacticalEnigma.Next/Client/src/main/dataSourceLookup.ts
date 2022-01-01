import { DataSourceParseResponse } from "../api/src";
import { api } from "./api"

export class DataSourceLookup {
    public async listDataSources() {
        return await api.listDataSources();
    }

    public async lookup(text: string, position: number, positionEnd: number | undefined, dataSourceIdentifiers: string[]) {
        const result = await api.requestInformationFromDataSources({
            body: {
                text: text,
                positions: [{ position: position, positionEnd: positionEnd }],
                requestedDataSources: dataSourceIdentifiers
            }
        });
        const map = new Map<string, DataSourceParseResponse>();
        for (const response of result) {
            map.set(response.dataSource, response);
        }
        return map;
    }
}