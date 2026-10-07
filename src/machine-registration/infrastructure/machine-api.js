import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const machinesEndpointPath = import.meta.env.VITE_MACHINES_ENDPOINT_PATH;
const stopEventsEndpointPath = import.meta.env.VITE_STOP_EVENTS_ENDPOINT_PATH;
const maintenanceRecordsEndpointPath = import.meta.env.VITE_MAINTENANCE_RECORDS_ENDPOINT_PATH;

export class MachineApi extends BaseApi {
    #machinesEndpoint;
    #stopEventsEndpoint;
    #maintenanceRecordsEndpoint;

    constructor() {
        super();
        this.#machinesEndpoint = new BaseEndpoint(this, machinesEndpointPath);
        this.#stopEventsEndpoint = new BaseEndpoint(this, stopEventsEndpointPath);
        this.#maintenanceRecordsEndpoint = new BaseEndpoint(this, maintenanceRecordsEndpointPath);
    }

    getMachines(){
        return this.#machinesEndpoint.getAll();
    }

    getMachineById(id){
        return this.#machinesEndpoint.getById(id);
    }

    createMachine(resource){
        return this.#machinesEndpoint.create(resource);
    }

    updateMachine(resource){
        return this.#machinesEndpoint.update(resource.id, resource);
    }

    deleteMachine(id){
        return this.#machinesEndpoint.delete(id);
    }

    getStopEvents() {
        return this.#stopEventsEndpoint.getAll();
    }

    createStopEvent(resource) {
        return this.#stopEventsEndpoint.create(resource);
    }
    updateStopEvent(resource) {
        return this.#stopEventsEndpoint.update(resource.id, resource);
    }

    getMaintenanceRecords() {
        return this.#maintenanceRecordsEndpoint.getAll();
    }
    createMaintenanceRecord(resource) {
        return this.#maintenanceRecordsEndpoint.create(resource);
    }
}