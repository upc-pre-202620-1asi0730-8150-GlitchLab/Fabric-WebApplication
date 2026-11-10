import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {InspectionParameters} from "../domain/model/inspection-parameters.js";
import {FabricInspectionService} from "../infrastructure/fabric-inspection.service.js";

const useInspectionParametersStore = defineStore('inspectionParameters', () => {
    const inspections = ref([]);
    const saving = ref(false);

    const pendingRolls = computed(() => inspections.value.filter((inspection) => !inspection.parameters));

    async function loadInspections() {
        inspections.value = await FabricInspectionService.getAll();
    }

    async function saveParameters(inspectionId, data) {
        const inspection = inspections.value.find((item) => item.id === inspectionId);
        const parameters = InspectionParameters.register(data);
        saving.value = true;
        try {
            const updated = await FabricInspectionService.update(inspectionId, {
                parameters,
                parameterHistory: [parameters.toHistoryEntry(), ...(inspection?.parameterHistory ?? [])]
            });
            inspections.value = inspections.value.map((item) => item.id === updated.id ? updated : item);
            return updated;
        } finally {
            saving.value = false;
        }
    }

    return {inspections, saving, pendingRolls, loadInspections, saveParameters};
});

export {useInspectionParametersStore};
