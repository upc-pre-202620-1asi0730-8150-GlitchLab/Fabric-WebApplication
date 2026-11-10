export const SHADE_CONDITION = Object.freeze({
    MATCHES: 'Matches approved sample',
    SLIGHT_VARIATION: 'Slight variation',
    OFF_SHADE: 'Off-shade'
});

export const DEFECT_TYPE = Object.freeze({
    NONE: 'None',
    HOLES: 'Holes',
    STAINS: 'Stains',
    SHADE_DIFFERENCE: 'Shade difference'
});

export const PARAMETERS_VALIDATION_ERROR = Object.freeze({
    REQUIRED: 'required',
    INVALID_MEASURE: 'invalidMeasure'
});

const REQUIRED_FIELDS = ['inspectionId', 'shadeCondition', 'defectsDetected'];
const MEASURE_FIELDS = ['fabricWidth', 'fabricLength'];

const hasValue = (value) => value !== '' && value !== null && value !== undefined;

export const validateInspectionParameters = (data) => {
    const errors = {};

    REQUIRED_FIELDS.forEach((field) => {
        if (!hasValue(data[field])) errors[field] = PARAMETERS_VALIDATION_ERROR.REQUIRED;
    });

    MEASURE_FIELDS.forEach((field) => {
        if (!hasValue(data[field])) errors[field] = PARAMETERS_VALIDATION_ERROR.REQUIRED;
        else if (!(Number(data[field]) > 0)) errors[field] = PARAMETERS_VALIDATION_ERROR.INVALID_MEASURE;
    });

    return errors;
};

export class InspectionParameters {
    constructor({fabricWidth, fabricLength, shadeCondition, defectsDetected, observations = '', updatedAt}) {
        this.fabricWidth = fabricWidth;
        this.fabricLength = fabricLength;
        this.shadeCondition = shadeCondition;
        this.defectsDetected = defectsDetected;
        this.observations = observations;
        this.updatedAt = updatedAt;
    }

    static register(data) {
        return new InspectionParameters({
            fabricWidth: Number(data.fabricWidth),
            fabricLength: Number(data.fabricLength),
            shadeCondition: data.shadeCondition,
            defectsDetected: data.defectsDetected,
            observations: String(data.observations ?? '').trim(),
            updatedAt: new Date().toISOString()
        });
    }

    toHistoryEntry() {
        const {updatedAt, ...fields} = this;
        return {date: updatedAt.split('T')[0], ...fields};
    }
}
