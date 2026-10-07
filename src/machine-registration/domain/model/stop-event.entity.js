export class StopEvent {
    constructor({id = null, machineId = '', cause = '', stoppedAt = '', resumedAt = null, durationMinutes = null, failureDescription = null}) {
        this.id = id;
        this.machineId = machineId;
        this.cause = cause;
        this.stoppedAt = stoppedAt;
        this.resumedAt = resumedAt;
        this.durationMinutes = durationMinutes;
        this.failureDescription = failureDescription;
    }
}