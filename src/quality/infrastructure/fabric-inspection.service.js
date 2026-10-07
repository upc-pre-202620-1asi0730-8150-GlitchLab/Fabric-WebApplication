import axios from 'axios'

const PRIMARY_API = 'http://localhost:3000/api/fabricInspections'
const FALLBACK_API = 'http://localhost:3000/fabricInspections'
const STORAGE_KEY = 'fabric_inspections_cache'

export class FabricInspectionService {
    static async getApiUrl() {
        try {
            await axios.get(PRIMARY_API, { timeout: 800 })
            return PRIMARY_API
        } catch {
            return FALLBACK_API
        }
    }

    static async getAll() {
        const endpoint = await this.getApiUrl()
        try {
            const response = await axios.get(endpoint, { timeout: 2000 })
            localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data))
            return response.data
        } catch {
            const cached = localStorage.getItem(STORAGE_KEY)
            return cached ? JSON.parse(cached) : []
        }
    }

    static async create(inspection) {
        const endpoint = await this.getApiUrl()
        try {
            const response = await axios.post(endpoint, inspection)
            return response.data
        } catch {
            const current = await this.getAll()
            current.push(inspection)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
            return inspection
        }
    }

    static async update(inspectionId, updatedFields) {
        const endpoint = await this.getApiUrl()
        try {
            const response = await axios.patch(`${endpoint}/${inspectionId}`, updatedFields)
            return response.data
        } catch {
            const current = await this.getAll()
            const index = current.findIndex(i => i.id === inspectionId)
            if (index !== -1) {
                current[index] = { ...current[index], ...updatedFields }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
                return current[index]
            }
            return null
        }
    }
}