import { http } from '../../shared/infrastructure/base-api.js'

const SUPPLIERS_PATH = '/suppliers'
const SAMPLES_PATH = '/fabricSamples'

export class FabricCatalogService {
    static async getSuppliers() {
        const { data } = await http.get(SUPPLIERS_PATH)
        return data
    }

    static async getSamples() {
        const { data } = await http.get(SAMPLES_PATH)
        return data
    }
}
