export class ProductionBatch {
    constructor({
                    id = 0,
                    batchNumber = '',
                    garmentModel = '',
                    projectedQuantity = 0,
                    currentStage = 'Cutting',
                    progressPercentage = 0,
                    deliveryDate = '',
                    status = 'In Production',
                    technicalSheetUrl = '',
                    notes = ''
                } = {}) {
        this.id = id;
        this.batchNumber = batchNumber || (id ? `LOT-${id}` : '');
        this.garmentModel = garmentModel;
        this.projectedQuantity = Number(projectedQuantity);
        this.currentStage = currentStage;
        this.progressPercentage = Number(progressPercentage);
        this.deliveryDate = deliveryDate;
        this.status = status;
        this.technicalSheetUrl = technicalSheetUrl;
        this.notes = notes;
    }

    getStatusBadgeSeverity() {
        switch (this.status) {
            case 'Completed': return 'success';
            case 'In Production': return 'info';
            case 'At Risk': return 'warning';
            case 'Delayed': return 'danger';
            default: return 'secondary';
        }
    }
}