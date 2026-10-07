/**
 * @summary Domain entity representing an Operator assigned to a batch stage.
 * @author Diego Sebastian Reategui Galarcep (u20201F165)
 */
export class BatchOperator {
    /**
     * @param {Object} [data={}] - Plain object data.
     */
    constructor({
                    id = 0,
                    batchId = 0,
                    operatorId = 0,
                    fullName = '',
                    specialty = '',
                    assignedStage = '',
                    assignmentDate = ''
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.operatorId = operatorId;
        this.fullName = fullName;
        this.specialty = specialty;
        this.assignedStage = assignedStage;
        this.assignmentDate = assignmentDate || new Date().toISOString().split('T')[0];
    }
}