import { http } from '../../shared/infrastructure/base-api.js'

const PATH = '/defects'

export class DefectService {
    static async getAll() {
        const { data } = await http.get(PATH)
        return data
    }

    static async create(defect) {
        const { data } = await http.post(PATH, defect)
        return data
    }

    static async update(defectId, updatedFields) {
        const { data } = await http.patch(`${PATH}/${encodeURIComponent(defectId)}`, updatedFields)
        return data
    }
}
