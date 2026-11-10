import {INSPECTION_RESULT, SHRINKAGE_TEST_STATUS} from "./fabric-inspection.js";
import {SHRINKAGE_RESULT} from "./shrinkage-test.js";

const countBy = (inspections, predicate) => inspections.filter(predicate).length;

export const summarizeInspections = (inspections) => {
    const suppliers = new Map();

    inspections.forEach((inspection) => {
        const entry = suppliers.get(inspection.supplier) ?? {supplier: inspection.supplier, conforming: 0, observed: 0};
        if (inspection.initialResult === INSPECTION_RESULT.CONFORMING) entry.conforming += 1;
        if (inspection.initialResult === INSPECTION_RESULT.OBSERVED) entry.observed += 1;
        suppliers.set(inspection.supplier, entry);
    });

    return {
        total: inspections.length,
        conforming: countBy(inspections, (item) => item.initialResult === INSPECTION_RESULT.CONFORMING),
        observed: countBy(inspections, (item) => item.initialResult === INSPECTION_RESULT.OBSERVED),
        shrinkage: {
            pending: countBy(inspections, (item) => item.shrinkageTest === SHRINKAGE_TEST_STATUS.PENDING),
            approved: countBy(inspections, (item) => item.shrinkageTest === SHRINKAGE_RESULT.APPROVED),
            nonCompliant: countBy(inspections, (item) => item.shrinkageTest === SHRINKAGE_RESULT.NON_COMPLIANT)
        },
        bySupplier: [...suppliers.values()]
    };
};

export const filterInspections = (inspections, {supplier = null, result = null, rollId = ''} = {}) => {
    const search = String(rollId ?? '').trim().toLowerCase();
    return inspections.filter((inspection) =>
        (!supplier || inspection.supplier === supplier) &&
        (!result || inspection.initialResult === result) &&
        (!search || String(inspection.rollId).toLowerCase().includes(search)));
};

export const sortByDateDescending = (inspections) =>
    [...inspections].sort((a, b) => String(b.inspectionDate).localeCompare(String(a.inspectionDate)));
