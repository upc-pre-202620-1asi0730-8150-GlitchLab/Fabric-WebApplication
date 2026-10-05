import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const machinesEndpointPath = import.meta.env.VITE_MACHINES_ENDPOINT_PATH;

export class MachineApi extends BaseApi {
    #machinesEndpoint;

    constructor() {
        super();
        this.#machinesEndpoint = new BaseEndpoint(this, machinesEndpointPath);
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
}