import { http } from '../../shared/infrastructure/base-api.js'

const PATH = '/fabric-inspections'

const toPercentText = (value) => typeof value === 'number' ? `${value}%` : value

const normalizeFields = (fields) => {
    if (!Array.isArray(fields.testHistory)) return fields
    return {
        ...fields,
        testHistory: fields.testHistory.map((test) => ({
            ...test,
            lenShrinkage: toPercentText(test.lenShrinkage),
            widthShrinkage: toPercentText(test.widthShrinkage)
        }))
    }
}

export class FabricInspectionService {
    static async getAll() {
        const { data } = await http.get(PATH)
        return data
    }

    static async getById(inspectionId) {
        const { data } = await http.get(`${PATH}/${encodeURIComponent(inspectionId)}`)
        return data
    }

    static async create(inspection) {
        const { data } = await http.post(PATH, inspection)
        return data
    }

    static async updateRollStatus(inspectionId, rollStatus) {
        const { data } = await http.put(`${PATH}/${encodeURIComponent(inspectionId)}/status`, { rollStatus })
        return data
    }

    static async update(inspectionId, updatedFields) {
        const { data } = await http.put(`${PATH}/${encodeURIComponent(inspectionId)}`, normalizeFields(updatedFields))
        return data
    }
}
