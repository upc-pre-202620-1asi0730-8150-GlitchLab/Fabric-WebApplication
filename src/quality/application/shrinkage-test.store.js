import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {
    resolveShrinkageTolerance,
    ShrinkageTest
} from "../domain/model/shrinkage-test.js";
import {SHRINKAGE_TEST_STATUS} from "../domain/model/fabric-inspection.js";
import {FabricInspectionService} from "../infrastructure/fabric-inspection.service.js";
import {FabricCatalogService} from "../infrastructure/fabric-catalog.service.js";

const useShrinkageTestStore = defineStore('shrinkageTest', () => {
    const inspections = ref([]);
    const samples = ref([]);
    const saving = ref(false);

    const pendingRolls = computed(() => inspections.value
        .filter((inspection) => inspection.shrinkageTest === SHRINKAGE_TEST_STATUS.PENDING)
        .map((inspection) => ({
            ...inspection,
            tolerance: resolveShrinkageTolerance(inspection.sample, samples.value)
        })));

    async function load() {
        const [inspectionList, sampleList] = await Promise.all([
            FabricInspectionService.getAll(),
            FabricCatalogService.getSamples()
        ]);
        inspections.value = inspectionList;
        samples.value = sampleList;
    }

    async function saveTest(inspectionId, data) {
        const roll = pendingRolls.value.find((item) => item.id === inspectionId);
        const history = roll?.testHistory ?? [];
        const defaultSampleId = `${roll.rollId}-S${history.length + 1}`;
        const test = ShrinkageTest.register(data, roll.tolerance, defaultSampleId);
        saving.value = true;
        try {
            const updated = await FabricInspectionService.update(inspectionId, {
                testHistory: [...history, test],
                shrinkageTest: test.result
            });
            inspections.value = inspections.value.map((item) => item.id === updated.id ? updated : item);
            return updated;
        } finally {
            saving.value = false;
        }
    }

    return {inspections, samples, saving, pendingRolls, load, saveTest};
});

export {useShrinkageTestStore};
