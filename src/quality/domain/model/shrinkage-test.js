export const SHRINKAGE_RESULT = Object.freeze({
    APPROVED: 'Approved',
    NON_COMPLIANT: 'Non-Compliant'
});

export const WASH_METHOD = Object.freeze({
    ISO_6330: 'Washing (ISO 6330)',
    ISO_3175: 'Dry cleaning (ISO 3175)'
});

export const DEFAULT_SHRINKAGE_TOLERANCE = 5;

export const SHRINKAGE_VALIDATION_ERROR = Object.freeze({
    REQUIRED: 'required',
    INVALID_MEASURE: 'invalidMeasure'
});

const REQUIRED_FIELDS = ['inspectionId', 'testDate', 'method'];
const MEASURE_FIELDS = ['initialLength', 'initialWidth', 'finalLength', 'finalWidth'];

const hasValue = (value) => value !== '' && value !== null && value !== undefined;
const roundOneDecimal = (value) => Math.round(value * 10) / 10;

export const validateShrinkageTest = (data) => {
    const errors = {};

    REQUIRED_FIELDS.forEach((field) => {
        if (!hasValue(data[field])) errors[field] = SHRINKAGE_VALIDATION_ERROR.REQUIRED;
    });

    MEASURE_FIELDS.forEach((field) => {
        if (!hasValue(data[field])) errors[field] = SHRINKAGE_VALIDATION_ERROR.REQUIRED;
        else if (!(Number(data[field]) > 0)) errors[field] = SHRINKAGE_VALIDATION_ERROR.INVALID_MEASURE;
    });

    return errors;
};

export const calculateShrinkage = (initial, final) =>
    ((Number(initial) - Number(final)) / Number(initial)) * 100;

export const resolveShrinkageTolerance = (sampleName, samples) =>
    samples.find((sample) => sample.name === sampleName)?.shrinkageTolerance ?? DEFAULT_SHRINKAGE_TOLERANCE;

export const evaluateShrinkage = (data, tolerance = DEFAULT_SHRINKAGE_TOLERANCE) => {
    const length = calculateShrinkage(data.initialLength, data.finalLength);
    const width = calculateShrinkage(data.initialWidth, data.finalWidth);
    const worst = Math.max(Math.abs(length), Math.abs(width));

    return {
        lengthShrinkage: roundOneDecimal(length),
        widthShrinkage: roundOneDecimal(width),
        tolerance,
        result: worst <= tolerance ? SHRINKAGE_RESULT.APPROVED : SHRINKAGE_RESULT.NON_COMPLIANT
    };
};

export class ShrinkageTest {
    constructor({
                    testDate,
                    method,
                    sampleId,
                    initialLength,
                    initialWidth,
                    finalLength,
                    finalWidth,
                    lenShrinkage,
                    widthShrinkage,
                    tolerance,
                    result,
                    note = ''
                }) {
        this.testDate = testDate;
        this.method = method;
        this.sampleId = sampleId;
        this.initialLength = initialLength;
        this.initialWidth = initialWidth;
        this.finalLength = finalLength;
        this.finalWidth = finalWidth;
        this.lenShrinkage = lenShrinkage;
        this.widthShrinkage = widthShrinkage;
        this.tolerance = tolerance;
        this.result = result;
        this.note = note;
    }

    static register(data, tolerance, defaultSampleId) {
        const evaluation = evaluateShrinkage(data, tolerance);
        return new ShrinkageTest({
            testDate: data.testDate,
            method: data.method,
            sampleId: String(data.sampleId ?? '').trim() || defaultSampleId,
            initialLength: Number(data.initialLength),
            initialWidth: Number(data.initialWidth),
            finalLength: Number(data.finalLength),
            finalWidth: Number(data.finalWidth),
            lenShrinkage: evaluation.lengthShrinkage,
            widthShrinkage: evaluation.widthShrinkage,
            tolerance: evaluation.tolerance,
            result: evaluation.result,
            note: String(data.note ?? '').trim()
        });
    }
}
