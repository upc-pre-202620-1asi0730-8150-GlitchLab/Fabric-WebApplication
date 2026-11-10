export class BatchStage {
    constructor({
                    id = 0,
                    batchId = 0,
                    name = '',
                    stage = '',
                    order = 1,
                    status = 'Pending',
                    processedQuantity = 0,
                    targetQuantity = 0
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.name = name || stage;
        this.stage = stage || name;
        this.order = Number(order);
        this.status = status;
        this.processedQuantity = Number(processedQuantity);
        this.targetQuantity = Number(targetQuantity);
    }

    getCompletionPercentage() {
        if (!this.targetQuantity || this.targetQuantity <= 0) return 0;
        const percentage = (this.processedQuantity / this.targetQuantity) * 100;
        return Math.min(Math.round(percentage), 100);
    }
}