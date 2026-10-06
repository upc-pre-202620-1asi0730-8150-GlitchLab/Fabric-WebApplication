export class MaintenanceRecord {
    constructor({id = null, machineId = '', date = '', maintenanceType = 'corrective', interventionPerformed = '', partsReplaced = '', technician = '', observations = ''}) {
        this.id = id;
        this.machineId = machineId;
        this.date = date;
        this.maintenanceType = maintenanceType; // 'corrective' | 'preventive'
        this.interventionPerformed = interventionPerformed;
        this.partsReplaced = partsReplaced;
        this.technician = technician;
        this.observations = observations;
    }
}