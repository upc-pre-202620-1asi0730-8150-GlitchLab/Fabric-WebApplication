/**
 * @summary Domain entity representing a quantity movement (Traceability) for a batch.
 * @author Diego Sebastian Reategui Galarcep (u20201F165)
 */
export class BatchMovement {
    /**
     * @param {Object} [data={}] - Plain object data.
     */
    constructor({
                    id = 0,
                    batchId = 0,
                    stageName = '',
                    qtyIn = 0,
                    qtyOut = 0,
                    responsiblePerson = '',
                    timestamp = ''
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.stageName = stageName;
        this.qtyIn = Number(qtyIn);
        this.qtyOut = Number(qtyOut);
        this.difference = this.qtyIn - this.qtyOut; // Positive value indicates loss/waste
        this.responsiblePerson = responsiblePerson;
        this.timestamp = timestamp || new Date().toISOString();
    }

    /**
     * Checks if there is a discrepancy between incoming and outgoing quantities.
     * @returns {boolean}
     */
    hasDiscrepancy() {
        return this.difference !== 0;
    }
}