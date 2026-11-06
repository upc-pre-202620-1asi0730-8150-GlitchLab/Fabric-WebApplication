import { BaseEndpoint } from '../../../shared/infrastructure/base-endpoint.js';
import { http } from '../../../shared/infrastructure/base-api.js';

/**
 * Talks to the "batches" collection of the json-server API.
 * (The collection is called "batches" in db.json, not "production-batches".)
 */
export class ProductionBatchesApiService extends BaseEndpoint {
    constructor() {
        super('/batches');
    }

    createBatch(batch) {
        return this.create(batch);
    }

    patch(id, partial) {
        return http.patch(`${this.endpoint}/${id}`, partial);
    }

    getByStage(stage) {
        return http.get(this.endpoint, { params: { currentStage: stage } });
    }

    getBatchMovements(batchId) {
        return http.get('/traceabilityHistory', { params: { batchId } });
    }

    addBatchMovement(movement) {
        return http.post('/traceabilityHistory', movement);
    }

    updateBatchMovement(id, partial) {
        return http.patch(`/traceabilityHistory/${id}`, partial);
    }

    getOperators() {
        return http.get('/operators');
    }

    getAssignedOperators(batchId) {
        return http.get('/assignedOperators', { params: { batchId } });
    }

    assignOperator(assignment) {
        return http.post('/assignedOperators', assignment);
    }

    getBatchObservations(batchId) {
        return http.get('/observations', { params: { batchId } });
    }

    addObservation(observation) {
        return http.post('/observations', observation);
    }
}
