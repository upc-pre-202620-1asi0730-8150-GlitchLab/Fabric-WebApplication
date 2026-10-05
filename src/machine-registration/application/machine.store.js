import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MachineApi} from "../infrastructure/machine-api.js";
import {MachineAssembler} from "../infrastructure/machine.assembler.js";

const machineApi = new MachineApi();

const useMachineStore = defineStore('machine-registration', () => {
    const machines = ref([]);
    const errors = ref([]);
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
        const resource = {
            ...machine,
            status: 'in-maintenance',
            currentDowntime: null,
            lastFailure: category,
            failureDescription: description || null,
            downtimeStartedAt: stoppedAt.toISOString()
        };

        return machineApi.updateMachine(resource).then(response => {
            const updated = MachineAssembler.toEntityFromResource(response.data);
            machines.value = machines.value.map(m => m.id === updated.id ? updated : m);
            return updated;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    return {
        machines, errors, machinesLoaded,
        totalMachines, operationalCount, inMaintenanceCount,
        fetchMachines, getMachineById, addMachine, deleteMachine, reportBreakdown
    };
});

export default useMachineStore;