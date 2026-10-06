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

    const totalMachines = computed(() => machines.value.length);
    const operationalCount = computed(() => machines.value.filter(m => m.status === 'operational').length);
    const inMaintenanceCount = computed(() => machines.value.filter(m => m.status === 'in-maintenance').length);

    function fetchMachines() {
        return machineApi.getMachines().then(response => {
            machines.value = MachineAssembler.toEntitiesFromResponse(response);
            machinesLoaded.value = true;
        }).catch(error => errors.value.push(error));
    }

    function getMachineById(id) {
        return machines.value.find(machine => String(machine.id) === String(id));
    }

    function generateNextId() {
        const maxId = machines.value
            .map(m => parseInt(m.id, 10))
            .filter(n => !isNaN(n))
            .reduce((max, n) => Math.max(max, n), 0);
        return String(maxId + 1);
    }

    function addMachine(machine) {
        machine.id = generateNextId();
        machine.status = 'operational';
        machine.currentDowntime = null;
        machine.lastFailure = null;

        machineApi.createMachine(machine).then(response => {
            machines.value.push(MachineAssembler.toEntityFromResource(response.data));
            return fetchMachines();
        }).catch(error => errors.value.push(error));
    }

    function deleteMachine(machine) {
        const removeLocal = () => {
            machines.value = machines.value.filter(m => m.id !== machine.id);
        };

        machineApi.deleteMachine(machine.id).then(() => {
            removeLocal();
            return fetchMachines();
        }).catch(error => {
            if (error.response?.status === 404) removeLocal();
            else errors.value.push(error);
        });
    }

    function reportBreakdown(machine, {category, description, stoppedAt}) {
        const stopEvent = {
            machineId: machine.id,
            cause: category,
            stoppedAt: stoppedAt.toISOString(),
            resumedAt: null,
            durationMinutes: null,
            failureDescription: description || null
        };

        return machineApi.createStopEvent(stopEvent).then(response => {
            stopEvents.value.push(response.data);
            machine.status = MACHINE_STATUS.MACHINE_STOPPED;
            machine.lastFailure = category;
            machine.downtimeStartedAt = stopEvent.stoppedAt;
            return machineApi.updateMachine(machine);
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    function registerMaintenance(machineId, recordData) {
        const record = {machineId, ...recordData};

        return machineApi.createMaintenanceRecord(record).then(response => {
            maintenanceRecords.value.push(response.data);
            const machine = machines.value.find(m => m.id === machineId);
            machine.status = MACHINE_STATUS.IN_MAINTENANCE;
            return machineApi.updateMachine(machine);
        }).catch(error => errors.value.push(error));
    }

    function resumeOperation(machineId, {resumedAt}) {
        const machine = machines.value.find(m => m.id === machineId);
        const openEvent = stopEvents.value.find(e => e.machineId === machineId && e.resumedAt === null);

        const resumedDate = new Date(resumedAt);
        const stoppedDate = new Date(machine.downtimeStartedAt);
        const durationMinutes = Math.round((resumedDate - stoppedDate) / 60000);

        const updates = openEvent
            ? machineApi.updateStopEvent({...openEvent, resumedAt, durationMinutes})
            : Promise.resolve();

        return updates.then(() => {
            machine.status = MACHINE_STATUS.OPERATIONAL;
            machine.currentDowntime = null;
            machine.lastFailure = null;
            machine.downtimeStartedAt = null;
            return machineApi.updateMachine(machine);
        }).catch(error => errors.value.push(error));
    }

    function fetchStopEvents() {
        machineApi.getStopEvents().then(response => stopEvents.value = response.data)
            .catch(error => errors.value.push(error));
    }

    function fetchMaintenanceRecords() {
        machineApi.getMaintenanceRecords().then(response => maintenanceRecords.value = response.data)
            .catch(error => errors.value.push(error));
    }

    return {
        machines,stopEvents, maintenanceRecords, errors, machinesLoaded,
        totalMachines, operationalCount, inMaintenanceCount,
        fetchMachines, getMachineById, addMachine, deleteMachine, reportBreakdown,
        registerMaintenance, resumeOperation,
        fetchStopEvents, fetchMaintenanceRecords
    };
});

export default useMachineStore;