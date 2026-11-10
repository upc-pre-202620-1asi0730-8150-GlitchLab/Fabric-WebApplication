import {INSPECTION_RESULT, SHADE_MATCH, WEAVE_CONDITION} from "../domain/model/fabric-inspection.js";

const OPTIONS_KEY = 'qualityInspector.newInspection.options';

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
