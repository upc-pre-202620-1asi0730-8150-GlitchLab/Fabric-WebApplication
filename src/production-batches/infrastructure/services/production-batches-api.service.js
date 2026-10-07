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
}
