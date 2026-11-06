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
                    stage = '',
                    qtyIn = 0,
                    qtyOut = 0,
                    difference,
                    responsiblePerson = '',
                    responsible = '',
                    timestamp = '',
                    dateTime = '',
                    status = ''
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.stageName = stageName || stage;
        this.stage = stage || stageName;
        this.qtyIn = Number(qtyIn);
        this.qtyOut = Number(qtyOut);
        this.difference = difference === undefined ? this.qtyIn - this.qtyOut : Number(difference);
        this.responsiblePerson = responsiblePerson || responsible;
        this.responsible = responsible || responsiblePerson;
        this.timestamp = timestamp || dateTime || new Date().toISOString();
        this.dateTime = dateTime || timestamp || this.timestamp;
        this.status = status;
    }

    /**
     * Checks if there is a discrepancy between incoming and outgoing quantities.
     * @returns {boolean}
     */
    hasDiscrepancy() {
        return this.difference !== 0;
    }
}