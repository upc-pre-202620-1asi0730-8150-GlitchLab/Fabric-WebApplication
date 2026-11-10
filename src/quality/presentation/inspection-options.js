import {INSPECTION_RESULT, SHADE_MATCH, WEAVE_CONDITION} from "../domain/model/fabric-inspection.js";
import {DEFECT_TYPE, SHADE_CONDITION} from "../domain/model/inspection-parameters.js";

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
