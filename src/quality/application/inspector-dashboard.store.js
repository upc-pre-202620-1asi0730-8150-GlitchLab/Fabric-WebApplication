import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {summarizeInspections} from "../domain/model/inspection-summary.js";
import {FabricInspectionService} from "../infrastructure/fabric-inspection.service.js";

const useInspectorDashboardStore = defineStore('inspectorDashboard', () => {
    const inspections = ref([]);

    const summary = computed(() => summarizeInspections(inspections.value));
    const suppliers = computed(() => [...new Set(inspections.value.map((inspection) => inspection.supplier))]);

    async function load() {
        inspections.value = await FabricInspectionService.getAll();
    }

    return {inspections, summary, suppliers, load};
});

export {useInspectorDashboardStore};
