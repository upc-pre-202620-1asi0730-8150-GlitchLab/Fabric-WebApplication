export class Alert {
    constructor({
                    id = null,
                    status = '',
                    type = '',
                    reference = '',
                    title = '',
                    description = '',
                    action = '',
                    accumulated = '',
                    limit = '',
                    excess = '',
                    machine = '',
                    batch = ''
                } = {}) {
        this.id = id;
        this.status = status;
        this.type = type;
        this.reference = reference;
        this.title = title;
        this.description = description;
        this.action = action;
        this.accumulated = accumulated;
        this.limit = limit;
        this.excess = excess;
        this.machine = machine;
        this.batch = batch;
    }
}