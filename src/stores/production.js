import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_FABRIC_API_URL || 'http://localhost:3000'

export const useProductionStore = defineStore('production', {
    state: () => ({
        dashboardData: null,
        batches: [],
        loading: false
    }),
    actions: {
        async loadDashboard(date) {
            this.loading = true
            try {
                const [prodRes, batchesRes] = await Promise.all([
                    axios.get(`${BASE_URL}/dashboard`, { params: { date } }),
                    axios.get(`${BASE_URL}/batches`, { params: { date } })
                ])

                this.dashboardData = prodRes.data
                this.batches = batchesRes.data
            } catch (error) {
                console.error('Error in productionStore.loadDashboard:', error)
            } finally {
                this.loading = false
            }
        }
    }
})