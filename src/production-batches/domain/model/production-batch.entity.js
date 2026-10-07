/**
 * @summary Domain entity representing a Production Batch.
 * @author Diego Sebastian Reategui Galarcep (u20201F165)
 */
export class ProductionBatch {
    /**
     * @param {Object} [data={}] - Plain object data.
     */
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

    /**
     * Helper to determine visual badge severity for PrimeVue UI.
     * @returns {string} Severity name ('success' | 'info' | 'warning' | 'danger' | 'secondary')
     */
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