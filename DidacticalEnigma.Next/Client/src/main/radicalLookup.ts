import { api } from "./api"

export class RadicalLookup {
    public async getRadicals() {
        return await api.listRadicals();
    }

    public async selectRadicals(radicals: string, sort?: string, select?: string, deselect?: string) {
        return await api.selectRadicals({
            query: radicals,
            sort: sort,
            select: select,
            deselect: deselect
        });
    }
}