/**
 * @summary Domain entity representing a Production Stage in a batch process lifecycle.
 * @author Diego Sebastian Reategui Galarcep (u20201F165)
 */
export class BatchStage {
    /**
     * @param {Object} [data={}] - Plain object data.
     */
    constructor({
                    id = 0,
                    batchId = 0,
                    name = '',
                    order = 1,
                    status = 'Pending',
                    processedQuantity = 0,
                    targetQuantity = 0
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.name = name; // 'Cutting', 'Sewing', 'Finishing', 'Completed'
        this.order = Number(order);
        this.status = status; // 'Pending', 'In Progress', 'Completed'
        this.processedQuantity = Number(processedQuantity);
        this.targetQuantity = Number(targetQuantity);
    }

    /**
     * Calculates completion percentage for this stage.
     * @returns {number}
     */
    getCompletionPercentage() {
        if (!this.targetQuantity || this.targetQuantity <= 0) return 0;
        const percentage = (this.processedQuantity / this.targetQuantity) * 100;
        return Math.min(Math.round(percentage), 100);
    }
}