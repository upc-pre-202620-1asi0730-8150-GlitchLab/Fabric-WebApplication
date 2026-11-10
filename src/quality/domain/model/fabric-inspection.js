export const INSPECTION_RESULT = Object.freeze({
    CONFORMING: 'Conforming',
    OBSERVED: 'Observed'
});

export const ROLL_STATUS = Object.freeze({
    AVAILABLE_FOR_CUTTING: 'Available for Cutting',
    BLOCKED: 'Blocked'
});

export const SHRINKAGE_TEST_STATUS = Object.freeze({
    PENDING: 'Pending'
});

export const SHADE_MATCH = Object.freeze({
    MATCHES: 'Matches client sample',
    SLIGHT_VARIATION: 'Slight variation',
    SEVERE_MISMATCH: 'Severe mismatch'
});

export const WEAVE_CONDITION = Object.freeze({
    NO_HOLES: 'No weave holes detected',
    MINOR_IRREGULARITIES: 'Minor irregularities',
    SEVERE_DEFECTS: 'Severe weave defects'
});

export const VALIDATION_ERROR = Object.freeze({
    REQUIRED: 'required',
    INVALID_LENGTH: 'invalidLength',
    OBSERVATION_REQUIRED: 'observationRequired',
    SEVERE_MUST_BE_OBSERVED: 'severeMustBeObserved'
});

const REQUIRED_FIELDS = ['rollId', 'supplier', 'inspectionDate', 'sample', 'color'];

const hasValue = (value) => value !== '' && value !== null && value !== undefined;

export const validateFabricInspection = (data) => {
    const errors = {};

    REQUIRED_FIELDS.forEach((field) => {
        if (!String(data[field] ?? '').trim()) errors[field] = VALIDATION_ERROR.REQUIRED;
    });

    if (hasValue(data.rollLength) && !(Number(data.rollLength) > 0)) {
        errors.rollLength = VALIDATION_ERROR.INVALID_LENGTH;
    }

    const isObserved = data.initialResult === INSPECTION_RESULT.OBSERVED;
    const hasSevereFinding =
        data.shadeMatch === SHADE_MATCH.SEVERE_MISMATCH ||
        data.weaveCondition === WEAVE_CONDITION.SEVERE_DEFECTS;

    if (isObserved && !String(data.observation ?? '').trim()) {
        errors.observation = VALIDATION_ERROR.OBSERVATION_REQUIRED;
    }
    if (hasSevereFinding && !isObserved) {
        errors.initialResult = VALIDATION_ERROR.SEVERE_MUST_BE_OBSERVED;
    }

    return errors;
};

export class FabricInspection {
    constructor({
                    id,
                    rollId,
                    supplier,
                    inspectionDate,
                    sample,
                    color,
                    rollLength = null,
                    shadeMatch,
                    weaveCondition,
                    initialResult,
                    observation = '',
                    shrinkageTest = SHRINKAGE_TEST_STATUS.PENDING,
                    rollStatus,
                    testHistory = [],
                    parameters = null
                }) {
        this.id = id;
        this.rollId = rollId;
        this.supplier = supplier;
        this.inspectionDate = inspectionDate;
        this.sample = sample;
        this.color = color;
        this.rollLength = rollLength;
        this.shadeMatch = shadeMatch;
        this.weaveCondition = weaveCondition;
        this.initialResult = initialResult;
        this.observation = observation;
        this.shrinkageTest = shrinkageTest;
        this.rollStatus = rollStatus;
        this.testHistory = testHistory;
        this.parameters = parameters;
    }

    static register(data) {
        const isConforming = data.initialResult === INSPECTION_RESULT.CONFORMING;
        return new FabricInspection({
            ...data,
            rollId: data.rollId.trim(),
            color: data.color.trim(),
            observation: String(data.observation ?? '').trim(),
            rollLength: hasValue(data.rollLength) ? Number(data.rollLength) : null,
            rollStatus: isConforming ? ROLL_STATUS.AVAILABLE_FOR_CUTTING : ROLL_STATUS.BLOCKED
        });
    }
}
