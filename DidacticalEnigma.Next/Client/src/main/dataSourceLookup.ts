import { api } from "./api"
import {DataSourceParseResponse, RequestInformationFromDataSourcesResponse} from "../api/src";
import {tuple} from "./utility";

export class DataSourceLookup {
    public async listDataSources() {
        return await api.listDataSources();
    }
    
    private slowSources = new Set<string>();

    public lookup(text: string, position: number, positionEnd: number | undefined, dataSourceIdentifiers: string[]): Promise<[string, DataSourceParseResponse][]>[] {
        const fastResultsTask = api.requestInformationFromDataSources({
            body: {
                text: text,
                positions: [{ position: position, positionEnd: positionEnd }],
                requestedDataSources: dataSourceIdentifiers.filter(id => !this.slowSources.has(id))
            }
        });
        let slowResultTask = this.slowSources.size > 0
            ? api.requestInformationFromDataSources({
                body: {
                    text: text,
                    positions: [{position: position, positionEnd: positionEnd}],
                    requestedDataSources: dataSourceIdentifiers.filter(id => this.slowSources.has(id))
                }
            })
            : Promise.resolve([]);

        const processResponse = async (task: Promise<RequestInformationFromDataSourcesResponse>) => {
            const responses = await task;
            for (const response of responses) {
                if (response.processingTime && response.processingTime > 500) {
                    this.slowSources.add(response.dataSource);
                }
            }

            return responses.map(response => tuple(response.dataSource, response));
        }
        
        return [fastResultsTask, slowResultTask].map(task => {
            return processResponse(task);
        });
    }
}


