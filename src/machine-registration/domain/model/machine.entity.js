export class Machine {
    constructor({id = null, code = '', type = '', batchId = '', status = 'operational', currentDowntime = null, lastFailure = null}) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.batchId = batchId;
        this.status = status;
        this.currentDowntime = currentDowntime;
        this.lastFailure = lastFailure;
    }
}