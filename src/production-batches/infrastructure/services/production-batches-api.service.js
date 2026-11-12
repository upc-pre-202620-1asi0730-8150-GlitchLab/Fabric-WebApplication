import { BaseEndpoint } from '../../../shared/infrastructure/base-endpoint.js';
import { http } from '../../../shared/infrastructure/base-api.js';

export class ProductionBatchesApiService extends BaseEndpoint {
    constructor() {
        super('/batches');
    }

    createBatch(batch) {
        return this.create({
            garmentModel: batch.garmentModel,
            projectedQuantity: batch.projectedQuantity,
            deliveryDate: batch.deliveryDate,
            notes: batch.notes
        });
    }

    updateBatch(id, resource) {
        return http.put(`${this.endpoint}/${id}`, resource);
    }

    getBatchMovements(batchId) {
        return http.get(`/traceabilityHistory/${batchId}`);
    }

    getOperators() {
        return http.get('/operators');
    }

    getAssignedOperators(batchId) {
        return http.get(`/assignedOperators/${batchId}`);
    }

    assignOperator(assignment) {
        return http.post('/assignedOperators', assignment);
    }

    getBatchObservations(batchId) {
        return http.get(`/observations/${batchId}`);
    }

    addObservation(observation) {
        return http.post('/observations', observation);
    }
}
