import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MachineApi} from "../infrastructure/machine-api.js";
import {MachineAssembler} from "../infrastructure/machine.assembler.js";
import {MACHINE_STATUS} from "../domain/model/machine-status.js";

const machineApi = new MachineApi();

const useMachineStore = defineStore('machine-registration', () => {
    const machines = ref([]);
    const errors = ref([]);
    const stopEvents = ref([]);
    const maintenanceRecords = ref([]);
    const machinesLoaded = ref(false);

    const getStopEventsForMachine = (machineId) =>
        computed(() => stopEvents.value.filter(e => e.machineId === machineId));

    const getMaintenanceRecordsForMachine = (machineId) =>
        computed(() => maintenanceRecords.value.filter(r => r.machineId === machineId));

    const totalMachines = computed(() => machines.value.length);
    const operationalCount = computed(() => machines.value.filter(m => m.status === 'operational').length);
    const inMaintenanceCount = computed(() => machines.value.filter(m => m.status === 'in-maintenance').length);

    function replaceEventsOf(machineId, events) {
        stopEvents.value = [...stopEvents.value.filter(e => e.machineId !== machineId), ...events];
    }

    function applyOpenDowntime(machine, events) {
        const openEvent = events.find(e => e.resumedAt === null);
        machine.downtimeStartedAt = openEvent ? openEvent.stoppedAt : null;
        machine.lastFailure = openEvent ? openEvent.cause : null;
        machine.failureDescription = openEvent ? openEvent.failureDescription : null;
    }

    function loadDowntimesOf(machine) {
        return machineApi.getDowntimes(machine.id).then(response => {
            const events = MachineAssembler.toStopEventsFromResponse(response);
            replaceEventsOf(machine.id, events);
            applyOpenDowntime(machine, events);
        });
    }

    function fetchMachines() {
        return machineApi.getMachines().then(response => {
            machines.value = MachineAssembler.toEntitiesFromResponse(response);
            return Promise.all(machines.value
                .filter(m => m.status === MACHINE_STATUS.MACHINE_STOPPED)
                .map(loadDowntimesOf));
        }).catch(error => errors.value.push(error))
            .finally(() => { machinesLoaded.value = true; });
    }

    function getMachineById(id) {
        return machines.value.find(machine => String(machine.id) === String(id));
    }

    function addMachine(machine) {
        return machineApi.createMachine(MachineAssembler.toRegisterResource(machine)).then(response => {
            machines.value.push(MachineAssembler.toEntityFromResource(response.data));
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    function reportBreakdown(machine, {category, description, stoppedAt}) {
        const resource = MachineAssembler.toDowntimeResource({category, description, stoppedAt: stoppedAt.toISOString()});

        return machineApi.createDowntime(machine.id, resource).then(() => {
            machine.status = MACHINE_STATUS.MACHINE_STOPPED;
            return loadDowntimesOf(machine);
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    function registerMaintenance(machineId, recordData) {
        const resource = MachineAssembler.toMaintenanceResource(recordData);

        return machineApi.createMaintenanceRecord(machineId, resource).then(() => {
            const machine = getMachineById(machineId);
            return machineApi.updateMachineStatus(machineId, MachineAssembler.toStatusResource(MACHINE_STATUS.IN_MAINTENANCE))
                .then(() => {
                    machine.status = MACHINE_STATUS.IN_MAINTENANCE;
                    return fetchMaintenanceRecords();
                });
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    function fetchStopEvents() {
        return Promise.all(machines.value.map(loadDowntimesOf))
            .catch(error => errors.value.push(error));
    }

    function fetchMaintenanceRecords() {
        return Promise.all(machines.value.map(machine =>
            machineApi.getMaintenanceRecords(machine.id).then(MachineAssembler.toMaintenanceRecordsFromResponse)))
            .then(groups => { maintenanceRecords.value = groups.flat(); })
            .catch(error => errors.value.push(error));
    }

    function resumeOperation(machine, {resumedAt}) {
        const openEvent = stopEvents.value.find(e => e.machineId === machine.id && e.resumedAt === null);

        const request = openEvent
            ? machineApi.resumeDowntime(machine.id, openEvent.id, MachineAssembler.toResumeResource({resumedAt: resumedAt.toISOString()}))
            : machineApi.updateMachineStatus(machine.id, MachineAssembler.toStatusResource(MACHINE_STATUS.OPERATIONAL));

        return request.then(() => {
            machine.status = MACHINE_STATUS.OPERATIONAL;
            machine.currentDowntime = null;
            machine.lastFailure = null;
            machine.downtimeStartedAt = null;
            return openEvent ? loadDowntimesOf(machine) : null;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    return {
        machines, stopEvents, maintenanceRecords, errors, machinesLoaded,
        totalMachines, operationalCount, inMaintenanceCount,
        fetchMachines, getMachineById, addMachine, reportBreakdown,
        registerMaintenance, resumeOperation,
        fetchStopEvents, fetchMaintenanceRecords,
        getStopEventsForMachine, getMaintenanceRecordsForMachine
    };
});

export default useMachineStore;
