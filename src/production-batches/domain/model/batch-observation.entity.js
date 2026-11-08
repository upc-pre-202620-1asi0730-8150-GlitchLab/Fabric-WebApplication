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
                    author = '',
                    category = 'General',
                    content = '',
                    text = '',
                    createdAt = '',
                    timestamp = ''
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.authorName = authorName || author;
        this.author = author || authorName;
        this.category = category; // 'General', 'Quality', 'Delay', 'Machine'
        this.content = content || text;
        this.text = text || content;
        this.createdAt = createdAt || timestamp || new Date().toLocaleString();
        this.timestamp = timestamp || createdAt || this.createdAt;
    }
}