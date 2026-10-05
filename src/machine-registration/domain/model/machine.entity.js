export class Machine {
    constructor({id = null, type = '', batchId = '', status = 'operational', currentDowntime = null, lastFailure = null, failureDescription = null, downtimeStartedAt = null}) {
        this.id = id;
        this.type = type;
        this.batchId = batchId;
        this.status = status;
        this.currentDowntime = currentDowntime;
        this.lastFailure = lastFailure;
        this.failureDescription = failureDescription;
        this.downtimeStartedAt = downtimeStartedAt;
    }
}