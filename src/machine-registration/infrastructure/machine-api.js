import {http} from "../../shared/infrastructure/base-api.js";

const machinesEndpointPath = import.meta.env.VITE_MACHINES_ENDPOINT_PATH || '/machines';
const downtimesSegment = import.meta.env.VITE_DOWNTIMES_ENDPOINT_SEGMENT || 'downtimes';
const maintenancesSegment = import.meta.env.VITE_MAINTENANCES_ENDPOINT_SEGMENT || 'maintenances';

export class MachineApi {
    getMachines() { return http.get(machinesEndpointPath); }
    getMachineById(id) { return http.get(`${machinesEndpointPath}/${id}`); }
    createMachine(resource) { return http.post(machinesEndpointPath, resource); }
    updateMachineStatus(id, resource) { return http.put(`${machinesEndpointPath}/${id}/status`, resource); }

    getDowntimes(machineId) { return http.get(`${machinesEndpointPath}/${machineId}/${downtimesSegment}`); }
    createDowntime(machineId, resource) { return http.post(`${machinesEndpointPath}/${machineId}/${downtimesSegment}`, resource); }
    resumeDowntime(machineId, downtimeId, resource) {
        return http.put(`${machinesEndpointPath}/${machineId}/${downtimesSegment}/${downtimeId}/resumption`, resource);
    }

    getMaintenanceRecords(machineId) { return http.get(`${machinesEndpointPath}/${machineId}/${maintenancesSegment}`); }
    createMaintenanceRecord(machineId, resource) { return http.post(`${machinesEndpointPath}/${machineId}/${maintenancesSegment}`, resource); }
}
