import { defineStore } from 'pinia';
import { ProductionBatchesApiService } from '../production-batches/infrastructure/services/production-batches-api.service.js';

const batchesService = new ProductionBatchesApiService();

export const useProductionStore = defineStore('production', {
    state: () => ({
        batches: [],
        currentBatch: null,
        loading: false,
        error: null
    }),

    getters: {
        /** { Cutting: 2, Sewing: 1, ... } used by the dashboard. */
        batchesByStage: (state) => state.batches.reduce((acc, batch) => {
            const stage = batch.currentStage || 'Unknown';
            acc[stage] = (acc[stage] || 0) + 1;
            return acc;
        }, {}),

        /** Next free code, e.g. LOT-088. */
        nextBatchNumber: (state) => {
            const max = state.batches
                .map(b => parseInt(String(b.batchNumber || '').replace(/\D/g, ''), 10))
                .filter(n => !isNaN(n))
                .reduce((m, n) => Math.max(m, n), 0);
            return `LOT-${String(max + 1).padStart(3, '0')}`;
        }
    },

    actions: {
        async fetchBatches() {
            this.loading = true;
            this.error = null;
            try {
                const response = await batchesService.getAll();
                this.batches = response.data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Could not load the production batches.';
            } finally {
                this.loading = false;
            }
        },

        async fetchBatchById(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await batchesService.getById(id);
                this.currentBatch = response.data;
            } catch (err) {
                this.error = 'Could not load the batch detail.';
            } finally {
                this.loading = false;
            }
        },

        async createBatch(batchData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await batchesService.createBatch(batchData);
                this.batches.push(response.data);
                return response.data;
            } catch (err) {
                this.error = 'Could not register the batch.';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});
