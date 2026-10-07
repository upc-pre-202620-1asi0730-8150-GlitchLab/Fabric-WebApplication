export class DefectRecord {
    constructor({
                    id,
                    batchId,
                    defectType,
                    quantity,
                    machineId = null,
                    origin = 'Known',
                    status = 'Pending Decision',
                    observation = '',
                    disposition = null,
                    correctionType = null,
                    date = new Date().toISOString()
                }) {
        this.id = id;
        this.batchId = batchId;
        this.defectType = defectType;
        this.quantity = Number(quantity);
        this.machineId = machineId;
        this.origin = origin;
        this.status = status;
        this.observation = observation;
        this.disposition = disposition;
        this.correctionType = correctionType;
        this.date = date;
    }
}