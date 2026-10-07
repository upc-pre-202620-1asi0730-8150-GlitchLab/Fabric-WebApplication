/**
 * @summary Domain entity representing an Operational Observation/Log for a batch.
 * @author Diego Sebastian Reategui Galarcep (u20201F165)
 */
export class BatchObservation {
    /**
     * @param {Object} [data={}] - Plain object data.
     */
    constructor({
                    id = 0,
                    batchId = 0,
                    authorName = '',
                    category = 'General',
                    content = '',
                    createdAt = ''
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.authorName = authorName;
        this.category = category; // 'General', 'Quality', 'Delay', 'Machine'
        this.content = content;
        this.createdAt = createdAt || new Date().toLocaleString();
    }
}