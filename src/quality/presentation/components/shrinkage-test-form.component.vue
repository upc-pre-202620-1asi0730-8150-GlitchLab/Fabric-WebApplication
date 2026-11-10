<script setup>
import {computed, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import {evaluateShrinkage, SHRINKAGE_RESULT, validateShrinkageTest} from "../../domain/model/shrinkage-test.js";
import {SHRINKAGE_RESULT_LABEL_KEYS, WASH_METHOD_OPTIONS} from "../inspection-options.js";

const props = defineProps({
  rolls: {type: Array, default: () => []},
  saving: {type: Boolean, default: false}
});
const emit = defineEmits(['save']);

const {t} = useI18n();
const I18N = 'qualityInspector.shrinkageTest';

const emptyForm = () => ({
  inspectionId: null,
  testDate: new Date().toISOString().split('T')[0],
  method: null,
  sampleId: '',
  initialLength: '',
  initialWidth: '',
  finalLength: '',
  finalWidth: '',
  note: ''
});

const form = reactive(emptyForm());
const errors = ref({});

const methodOptions = computed(() => WASH_METHOD_OPTIONS.map(({value, labelKey}) => ({value, label: t(labelKey)})));
const rollOptions = computed(() => props.rolls.map((roll) => ({value: roll.id, label: `${roll.rollId} · ${roll.supplier}`})));
const selectedRoll = computed(() => props.rolls.find((roll) => roll.id === form.inspectionId) ?? null);

const evaluation = computed(() => {
  const measures = [form.initialLength, form.initialWidth, form.finalLength, form.finalWidth];
  if (measures.some((measure) => !(Number(measure) > 0))) return null;
  return evaluateShrinkage(form, selectedRoll.value?.tolerance);
});

const isApproved = computed(() => evaluation.value?.result === SHRINKAGE_RESULT.APPROVED);
const resultLabel = computed(() => evaluation.value ? t(SHRINKAGE_RESULT_LABEL_KEYS[evaluation.value.result]) : '');
const percent = (value) => `${value}${t(`${I18N}.units.percent`)}`;

const errorText = (field) => errors.value[field] ? t(`${I18N}.errors.${errors.value[field]}`) : '';

const submit = () => {
  errors.value = validateShrinkageTest(form);
  if (Object.keys(errors.value).length > 0) return;
  emit('save', {...form});
};

const reset = () => {
  Object.assign(form, emptyForm());
  errors.value = {};
};

defineExpose({reset});
</script>

<template>
  <form class="inspection-form" novalidate @submit.prevent="submit">
    <section class="inspection-form-section">
      <header class="inspection-form-section-header">
        <span class="inspection-form-step">1</span>
        <div>
          <h2>{{ t(`${I18N}.rollSection.title`) }}</h2>
          <p>{{ t(`${I18N}.rollSection.subtitle`) }}</p>
        </div>
      </header>

      <div class="inspection-form-grid">
        <div class="inspection-field inspection-field-full">
          <label for="shrinkage-roll">{{ t(`${I18N}.fields.roll`) }} *</label>
          <pv-select input-id="shrinkage-roll" v-model="form.inspectionId" :options="rollOptions"
                     option-label="label" option-value="value" :disabled="rolls.length === 0"
                     :invalid="!!errors.inspectionId" :placeholder="t(`${I18N}.placeholders.roll`)"/>
          <small v-if="errors.inspectionId" class="inspection-field-error">{{ errorText('inspectionId') }}</small>
          <small v-if="rolls.length === 0" class="inspection-empty">{{ t(`${I18N}.empty`) }}</small>
        </div>
      </div>

      <div v-if="selectedRoll" class="inspection-roll-summary">
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.summary.rollId`) }}</span>
          <strong>{{ selectedRoll.rollId }}</strong>
        </div>
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.summary.supplier`) }}</span>
          <strong>{{ selectedRoll.supplier }}</strong>
        </div>
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.summary.sample`) }}</span>
          <strong>{{ selectedRoll.sample }}</strong>
        </div>
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.summary.tolerance`) }}</span>
          <strong>{{ percent(selectedRoll.tolerance) }}</strong>
        </div>
      </div>
    </section>

    <section class="inspection-form-section">
      <header class="inspection-form-section-header">
        <span class="inspection-form-step">2</span>
        <div>
          <h2>{{ t(`${I18N}.testSection.title`) }}</h2>
          <p>{{ t(`${I18N}.testSection.subtitle`) }}</p>
        </div>
      </header>

      <div class="inspection-form-grid">
        <div class="inspection-field">
          <label for="shrinkage-date">{{ t(`${I18N}.fields.testDate`) }} *</label>
          <pv-input-text id="shrinkage-date" v-model="form.testDate" type="date" :invalid="!!errors.testDate"/>
          <small v-if="errors.testDate" class="inspection-field-error">{{ errorText('testDate') }}</small>
        </div>

        <div class="inspection-field">
          <label for="shrinkage-method">{{ t(`${I18N}.fields.method`) }} *</label>
          <pv-select input-id="shrinkage-method" v-model="form.method" :options="methodOptions"
                     option-label="label" option-value="value" :invalid="!!errors.method"
                     :placeholder="t(`${I18N}.placeholders.method`)"/>
          <small v-if="errors.method" class="inspection-field-error">{{ errorText('method') }}</small>
        </div>

        <div class="inspection-field">
          <label for="shrinkage-sample-id">{{ t(`${I18N}.fields.sampleId`) }}</label>
          <pv-input-text id="shrinkage-sample-id" v-model="form.sampleId"
                         :placeholder="t(`${I18N}.placeholders.sampleId`)"/>
        </div>
      </div>
    </section>

    <section class="inspection-form-section">
      <header class="inspection-form-section-header">
        <span class="inspection-form-step">3</span>
        <div>
          <h2>{{ t(`${I18N}.measurementsSection.title`) }}</h2>
          <p>{{ t(`${I18N}.measurementsSection.subtitle`) }}</p>
        </div>
      </header>

      <div class="inspection-form-grid">
        <div class="inspection-field">
          <label for="initial-length">{{ t(`${I18N}.fields.initialLength`) }} *</label>
          <div class="inspection-field-unit">
            <pv-input-text id="initial-length" v-model="form.initialLength" type="number" min="0" step="any"
                           :invalid="!!errors.initialLength" :placeholder="t(`${I18N}.placeholders.measure`)"/>
            <span>{{ t(`${I18N}.units.measure`) }}</span>
          </div>
          <small v-if="errors.initialLength" class="inspection-field-error">{{ errorText('initialLength') }}</small>
        </div>

        <div class="inspection-field">
          <label for="initial-width">{{ t(`${I18N}.fields.initialWidth`) }} *</label>
          <div class="inspection-field-unit">
            <pv-input-text id="initial-width" v-model="form.initialWidth" type="number" min="0" step="any"
                           :invalid="!!errors.initialWidth" :placeholder="t(`${I18N}.placeholders.measure`)"/>
            <span>{{ t(`${I18N}.units.measure`) }}</span>
          </div>
          <small v-if="errors.initialWidth" class="inspection-field-error">{{ errorText('initialWidth') }}</small>
        </div>

        <div class="inspection-field"></div>

        <div class="inspection-field">
          <label for="final-length">{{ t(`${I18N}.fields.finalLength`) }} *</label>
          <div class="inspection-field-unit">
            <pv-input-text id="final-length" v-model="form.finalLength" type="number" min="0" step="any"
                           :invalid="!!errors.finalLength" :placeholder="t(`${I18N}.placeholders.measure`)"/>
            <span>{{ t(`${I18N}.units.measure`) }}</span>
          </div>
          <small v-if="errors.finalLength" class="inspection-field-error">{{ errorText('finalLength') }}</small>
        </div>

        <div class="inspection-field">
          <label for="final-width">{{ t(`${I18N}.fields.finalWidth`) }} *</label>
          <div class="inspection-field-unit">
            <pv-input-text id="final-width" v-model="form.finalWidth" type="number" min="0" step="any"
                           :invalid="!!errors.finalWidth" :placeholder="t(`${I18N}.placeholders.measure`)"/>
            <span>{{ t(`${I18N}.units.measure`) }}</span>
          </div>
          <small v-if="errors.finalWidth" class="inspection-field-error">{{ errorText('finalWidth') }}</small>
        </div>

        <div class="inspection-field inspection-field-full">
          <label for="shrinkage-note">{{ t(`${I18N}.fields.note`) }}</label>
          <pv-textarea id="shrinkage-note" v-model="form.note" rows="3" auto-resize
                       :placeholder="t(`${I18N}.placeholders.note`)"/>
        </div>
      </div>

      <div class="inspection-roll-summary">
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.result.lengthShrinkage`) }}</span>
          <strong>{{ evaluation ? percent(evaluation.lengthShrinkage) : t(`${I18N}.result.empty`) }}</strong>
        </div>
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.result.widthShrinkage`) }}</span>
          <strong>{{ evaluation ? percent(evaluation.widthShrinkage) : t(`${I18N}.result.empty`) }}</strong>
        </div>
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.result.status`) }}</span>
          <strong v-if="evaluation" class="inspection-result-badge"
                  :class="isApproved ? 'inspection-result-badge-approved' : 'inspection-result-badge-non-compliant'">
            {{ resultLabel }}
          </strong>
          <strong v-else>{{ t(`${I18N}.result.empty`) }}</strong>
        </div>
      </div>
    </section>

    <footer class="inspection-form-footer">
      <p class="inspection-form-banner">{{ t(`${I18N}.hint`) }}</p>

      <div class="inspection-form-actions">
        <pv-button type="button" :label="t(`${I18N}.actions.clear`)" icon="pi pi-eraser"
                   severity="secondary" outlined @click="reset"/>
        <pv-button type="submit" class="inspection-submit" :label="t(`${I18N}.actions.save`)"
                   icon="pi pi-check" :loading="saving"/>
      </div>
    </footer>
  </form>
</template>
