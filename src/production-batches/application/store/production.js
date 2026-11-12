import { defineStore } from 'pinia';
import { ProductionBatchesApiService } from '../../infrastructure/services/production-batches-api.service.js';
import {
    toBatchMovement,
    toBatchObservation,
    toBatchOperator,
    toProductionBatch,
    toObservationPayload,
    toOperatorAssignmentPayload
} from '../../infrastructure/services/production-batches.assembler.js';
import { BatchObservation } from '../../domain/model/batch-observation.entity.js';
import { BatchOperator } from '../../domain/model/batch-operator.entity.js';

const batchesService = new ProductionBatchesApiService();

export const useProductionStore = defineStore('production', {
    state: () => ({
        batches: [],
        currentBatch: null,
        loading: false,
        error: null
    }),

    getters: {
        batchesByStage: (state) => state.batches.reduce((acc, batch) => {
            const stage = batch.currentStage || 'Unknown';
            acc[stage] = (acc[stage] || 0) + 1;
            return acc;
        }, {}),

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
                this.batches = response.data.map(toProductionBatch);
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
                this.currentBatch = toProductionBatch(response.data);
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
                const batch = toProductionBatch(response.data);
                this.batches.push(batch);
                return batch;
            } catch (err) {
                this.error = 'Could not register the batch.';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async loadBatch(id) {
            const response = await batchesService.getById(id);
            return toProductionBatch(response.data);
        },

        async loadOperators() {
            const response = await batchesService.getOperators();
            return response.data;
        },

        async loadAssignedOperators(batchId) {
            const response = await batchesService.getAssignedOperators(batchId);
            return response.data.map(toBatchOperator);
        },

        async assignOperator(assignment) {
            const operator = new BatchOperator(assignment);
            const response = await batchesService.assignOperator(toOperatorAssignmentPayload(operator));
            return toBatchOperator(response.data);
        },

        async loadObservations(batchId) {
            const response = await batchesService.getBatchObservations(batchId);
            return response.data.map(toBatchObservation);
        },

        async addObservation({ batchId, text, timestamp }) {
            const observation = new BatchObservation({
                batchId,
                authorName: 'Registered by Supervisor',
                content: text,
                createdAt: timestamp
            });
            const response = await batchesService.addObservation(toObservationPayload(observation));
            return toBatchObservation(response.data);
        },

        async loadBatchMovements(batchId) {
            const response = await batchesService.getBatchMovements(batchId);
            return response.data.map(toBatchMovement);
        },

        async updateBatchStage(batch, updateForm, stages) {
            if (!stages.includes(updateForm.newStage)) return;

            const quantity = Number(updateForm.processedQuantity);
            await batchesService.updateBatch(batch.id, {
                currentStage: updateForm.newStage,
                processedQuantity: quantity > 0 ? quantity : null
            });
        }
    }
});