import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000/api'

export const useProductionStore = defineStore('production', {
    state: () => ({
        productionData: [],
        batches: [],
        loading: false,
        error: null
    }),

    getters: {
        totalProduced: (state) => {
            return state.productionData.reduce(
                (total, item) => total + Number(item.garments),
                0
            )
        },

        averagePerHour: (state) => {
            if (state.productionData.length === 0) {
                return 0
            }

            const total = state.productionData.reduce(
                (sum, item) => sum + Number(item.garments),
                0
            )

            return Math.round(total / state.productionData.length)
        },

        batchesByStage: (state) => {
            const result = {}

            state.batches.forEach(batch => {
                if (!result[batch.stage]) {
                    result[batch.stage] = 0
                }

                result[batch.stage]++
            })

            return result
        },

        dailyCompliance: (state) => {
            const target = 1500

            if (target === 0) {
                return 0
            }

            const total = state.productionData.reduce(
                (sum, item) => sum + Number(item.garments),
                0
            )

            return Math.min(Math.round((total / target) * 100), 100)
        }
    },

    actions: {
        async getProductionData(date) {
            this.loading = true
            this.error = null

            try {
                const response = await fetch(
                    `${API_URL}/production?date=${date}`
                )

                if (!response.ok) {
                    throw new Error('No se pudieron obtener los datos de produccion')
                }

                this.productionData = await response.json()
            } catch (error) {
                this.error = error.message
                this.productionData = []
            } finally {
                this.loading = false
            }
        },

        async getBatches(date) {
            try {
                const response = await fetch(
                    `${API_URL}/batches?date=${date}`
                )

                if (!response.ok) {
                    throw new Error('No se pudieron obtener los lotes')
                }

                this.batches = await response.json()
            } catch (error) {
                this.error = error.message
                this.batches = []
            }
        },

        async loadDashboard(date) {
            this.loading = true
            this.error = null

            try {
                await Promise.all([
                    this.getProductionData(date),
                    this.getBatches(date)
                ])
            } finally {
                this.loading = false
            }
        }
    }
})