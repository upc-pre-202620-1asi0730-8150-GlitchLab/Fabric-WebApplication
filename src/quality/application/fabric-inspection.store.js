import {defineStore} from "pinia";
import {ref} from "vue";
import {FabricInspection} from "../domain/model/fabric-inspection.js";
import {FabricInspectionService} from "../infrastructure/fabric-inspection.service.js";
import {FabricCatalogService} from "../infrastructure/fabric-catalog.service.js";

const useFabricInspectionStore = defineStore('fabricInspection', () => {
    const suppliers = ref([]);
    const samples = ref([]);
    const saving = ref(false);

    async function loadCatalogs() {
        const [supplierList, sampleList] = await Promise.all([
            FabricCatalogService.getSuppliers(),
            FabricCatalogService.getSamples()
        ]);
        suppliers.value = supplierList;
        samples.value = sampleList;
    }

    async function register(data) {
        saving.value = true;
        try {
            return await FabricInspectionService.create(FabricInspection.register(data));
        } finally {
            saving.value = false;
        }
    }

    return {suppliers, samples, saving, loadCatalogs, register};
});

export {useFabricInspectionStore};
