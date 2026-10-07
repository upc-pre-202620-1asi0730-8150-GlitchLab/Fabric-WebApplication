import { http } from '../../shared/infrastructure/base-api.js'

const PATH = '/fabricInspections'

export class FabricInspectionService {
    static async getAll() {
        const { data } = await http.get(PATH)
        return data
    }

    static async create(inspection) {
        const { data } = await http.post(PATH, inspection)
        return data
    }

    static async update(inspectionId, updatedFields) {
        const { data } = await http.patch(`${PATH}/${encodeURIComponent(inspectionId)}`, updatedFields)
        return data
    }
}
