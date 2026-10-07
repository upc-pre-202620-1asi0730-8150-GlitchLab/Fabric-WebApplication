import axios from 'axios'

const BASE_URL = import.meta.env.VITE_FABRIC_API_URL || 'http://localhost:3000'
const PRIMARY_API = `${BASE_URL}/api/defects`
const FALLBACK_API = `${BASE_URL}/defects`
const STORAGE_KEY = 'fabric_defects_cache'

export class DefectService {
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

    static async create(defect) {
        const endpoint = await this.getApiUrl()
        try {
            const response = await axios.post(endpoint, defect)
            return response.data
        } catch {
            const current = await this.getAll()
            current.push(defect)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
            return defect
        }
    }

    static async update(defectId, updatedFields) {
        const endpoint = await this.getApiUrl()
        try {
            const response = await axios.patch(`${endpoint}/${defectId}`, updatedFields)
            return response.data
        } catch {
            const current = await this.getAll()
            const index = current.findIndex(d => d.id === defectId)
            if (index !== -1) {
                current[index] = { ...current[index], ...updatedFields }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
                return current[index]
            }
            return null
        }
    }
}