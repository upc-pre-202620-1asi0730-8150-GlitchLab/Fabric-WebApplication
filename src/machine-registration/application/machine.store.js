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
        machineApi.getMachines().then(response => {
            machines.value = MachineAssembler.toEntitiesFromResponse(response);
            machinesLoaded.value = true;
        }).catch(error => errors.value.push(error));
    }

    function getMachineById(id) {
        return machines.value.find(machine => machine.id === id);
    }

    /**
     * Generates the next machine code (MC-0XX) based on the highest existing one.
     * @returns {string}
     */
    function generateNextCode() {
        const maxNumber = machines.value
            .map(m => parseInt(String(m.code).replace('MC-', ''), 10))
            .filter(n => !isNaN(n))
            .reduce((max, n) => Math.max(max, n), 0);
        return `MC-${String(maxNumber + 1).padStart(3, '0')}`;
    }

    /**
     * Registers a new machine. Always created as 'operational', with no
     * downtime or failure recorded — that invariant lives here, once,
     * regardless of what the form happens to send.
     * @param {Machine} machine
     */
    function addMachine(machine) {
        machine.code = generateNextCode();
        machine.status = 'operational';
        machine.currentDowntime = null;
        machine.lastFailure = null;

        machineApi.createMachine(machine).then(response => {
            machines.value.push(MachineAssembler.toEntityFromResource(response.data));
        }).catch(error => errors.value.push(error));
    }

    return {
        machines, errors, machinesLoaded,
        totalMachines, operationalCount, inMaintenanceCount,
        fetchMachines, getMachineById, addMachine
    };
});

export default useMachineStore;