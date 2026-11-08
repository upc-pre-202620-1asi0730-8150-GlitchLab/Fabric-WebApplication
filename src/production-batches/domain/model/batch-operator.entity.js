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
                    operatorName = '',
                    specialty = '',
                    assignedStage = '',
                    stage = '',
                    assignmentDate = '',
                    assignedAt = ''
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.operatorId = operatorId;
        this.fullName = fullName || operatorName;
        this.operatorName = operatorName || fullName;
        this.specialty = specialty;
        this.assignedStage = assignedStage || stage;
        this.stage = stage || assignedStage;
        this.assignmentDate = assignmentDate || assignedAt || new Date().toISOString().split('T')[0];
        this.assignedAt = assignedAt || assignmentDate || this.assignmentDate;
    }
}