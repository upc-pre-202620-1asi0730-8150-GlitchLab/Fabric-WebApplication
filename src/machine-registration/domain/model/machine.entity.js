export class Machine {
    constructor({id = null, code = '', type = '', location = '', acquiredDate = null, status = 'operational', currentDowntime = null, lastFailure = null, failureDescription = null, downtimeStartedAt = null}) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.location = location;
        this.acquiredDate = acquiredDate;
        this.status = status;
        this.currentDowntime = currentDowntime;
        this.lastFailure = lastFailure;
        this.failureDescription = failureDescription;
        this.downtimeStartedAt = downtimeStartedAt;
    }
}
