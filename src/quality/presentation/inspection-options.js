import {
    INSPECTION_RESULT,
    ROLL_STATUS,
    SHADE_MATCH,
    SHRINKAGE_TEST_STATUS,
    WEAVE_CONDITION
} from "../domain/model/fabric-inspection.js";
import {DEFECT_TYPE, SHADE_CONDITION} from "../domain/model/inspection-parameters.js";
import {SHRINKAGE_RESULT, WASH_METHOD} from "../domain/model/shrinkage-test.js";

const OPTIONS_KEY = 'qualityInspector.newInspection.options';
const PARAMETER_OPTIONS_KEY = 'qualityInspector.parameters.options';

export const SHADE_MATCH_OPTIONS = [
    {value: SHADE_MATCH.MATCHES, labelKey: `${OPTIONS_KEY}.shadeMatch.matches`},
    {value: SHADE_MATCH.SLIGHT_VARIATION, labelKey: `${OPTIONS_KEY}.shadeMatch.slightVariation`},
    {value: SHADE_MATCH.SEVERE_MISMATCH, labelKey: `${OPTIONS_KEY}.shadeMatch.severeMismatch`}
];

export const WEAVE_CONDITION_OPTIONS = [
    {value: WEAVE_CONDITION.NO_HOLES, labelKey: `${OPTIONS_KEY}.weaveCondition.noHoles`},
    {value: WEAVE_CONDITION.MINOR_IRREGULARITIES, labelKey: `${OPTIONS_KEY}.weaveCondition.minorIrregularities`},
    {value: WEAVE_CONDITION.SEVERE_DEFECTS, labelKey: `${OPTIONS_KEY}.weaveCondition.severeDefects`}
];

export const RESULT_OPTIONS = [
    {value: INSPECTION_RESULT.CONFORMING, labelKey: `${OPTIONS_KEY}.result.conforming`},
    {value: INSPECTION_RESULT.OBSERVED, labelKey: `${OPTIONS_KEY}.result.observed`}
];

export const SHADE_CONDITION_OPTIONS = [
    {value: SHADE_CONDITION.MATCHES, labelKey: `${PARAMETER_OPTIONS_KEY}.shadeCondition.matches`},
    {value: SHADE_CONDITION.SLIGHT_VARIATION, labelKey: `${PARAMETER_OPTIONS_KEY}.shadeCondition.slightVariation`},
    {value: SHADE_CONDITION.OFF_SHADE, labelKey: `${PARAMETER_OPTIONS_KEY}.shadeCondition.offShade`}
];

export const DEFECT_OPTIONS = [
    {value: DEFECT_TYPE.NONE, labelKey: `${PARAMETER_OPTIONS_KEY}.defects.none`},
    {value: DEFECT_TYPE.HOLES, labelKey: `${PARAMETER_OPTIONS_KEY}.defects.holes`},
    {value: DEFECT_TYPE.STAINS, labelKey: `${PARAMETER_OPTIONS_KEY}.defects.stains`},
    {value: DEFECT_TYPE.SHADE_DIFFERENCE, labelKey: `${PARAMETER_OPTIONS_KEY}.defects.shadeDifference`}
];

const SHRINKAGE_KEY = 'qualityInspector.shrinkageTest';

export const WASH_METHOD_OPTIONS = [
    {value: WASH_METHOD.ISO_6330, labelKey: `${SHRINKAGE_KEY}.options.method.iso6330`},
    {value: WASH_METHOD.ISO_3175, labelKey: `${SHRINKAGE_KEY}.options.method.iso3175`}
];

export const SHRINKAGE_RESULT_LABEL_KEYS = {
    [SHRINKAGE_RESULT.APPROVED]: `${SHRINKAGE_KEY}.result.approved`,
    [SHRINKAGE_RESULT.NON_COMPLIANT]: `${SHRINKAGE_KEY}.result.nonCompliant`
};

const STATUS_KEY = 'qualityInspector.dashboard.status';

export const RESULT_STATUS_DISPLAY = {
    [INSPECTION_RESULT.CONFORMING]: {labelKey: `${STATUS_KEY}.conforming`, tone: 'approved'},
    [INSPECTION_RESULT.OBSERVED]: {labelKey: `${STATUS_KEY}.observed`, tone: 'non-compliant'}
};

export const SHRINKAGE_STATUS_DISPLAY = {
    [SHRINKAGE_TEST_STATUS.PENDING]: {labelKey: `${STATUS_KEY}.pending`, tone: 'pending'},
    [SHRINKAGE_RESULT.APPROVED]: {labelKey: `${STATUS_KEY}.approved`, tone: 'approved'},
    [SHRINKAGE_RESULT.NON_COMPLIANT]: {labelKey: `${STATUS_KEY}.nonCompliant`, tone: 'non-compliant'}
};

export const ROLL_STATUS_DISPLAY = {
    [ROLL_STATUS.AVAILABLE_FOR_CUTTING]: {labelKey: `${STATUS_KEY}.available`, tone: 'approved'},
    [ROLL_STATUS.BLOCKED]: {labelKey: `${STATUS_KEY}.blocked`, tone: 'non-compliant'}
};

const SUPERVISOR_PARAMETERS_KEY = 'quality.parameters.options';

export const WEAVE_PARAMETER_OPTIONS = [
    {value: 'No weave defects', labelKey: `${SUPERVISOR_PARAMETERS_KEY}.weave.none`},
    {value: 'Minor slubs', labelKey: `${SUPERVISOR_PARAMETERS_KEY}.weave.minorSlubs`},
    {value: 'Defects detected', labelKey: `${SUPERVISOR_PARAMETERS_KEY}.weave.defects`}
];

export const SURFACE_CONDITION_OPTIONS = [
    {value: 'No stains or damage', labelKey: `${SUPERVISOR_PARAMETERS_KEY}.surface.clean`},
    {value: 'Slight grease traces', labelKey: `${SUPERVISOR_PARAMETERS_KEY}.surface.greaseTraces`},
    {value: 'Damaged surface', labelKey: `${SUPERVISOR_PARAMETERS_KEY}.surface.damaged`}
];
