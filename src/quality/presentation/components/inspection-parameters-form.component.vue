<script setup>
import {computed, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {validateInspectionParameters} from "../../domain/model/inspection-parameters.js";
import {DEFECT_OPTIONS, RESULT_OPTIONS, SHADE_CONDITION_OPTIONS} from "../inspection-options.js";

const props = defineProps({
  rolls: {type: Array, default: () => []},
  saving: {type: Boolean, default: false}
});
const emit = defineEmits(['save']);

const {t} = useI18n();
const I18N = 'qualityInspector.parameters';

const emptyForm = () => ({
  inspectionId: null,
  shadeCondition: null,
  fabricWidth: '',
  fabricLength: '',
  defectsDetected: null,
  observations: ''
});

const form = reactive(emptyForm());
const errors = ref({});

const translate = (options) => options.map(({value, labelKey}) => ({value, label: t(labelKey)}));
const shadeConditionOptions = computed(() => translate(SHADE_CONDITION_OPTIONS));
const defectOptions = computed(() => translate(DEFECT_OPTIONS));
const rollOptions = computed(() => props.rolls.map((roll) => ({value: roll.id, label: `${roll.rollId} · ${roll.supplier}`})));

const selectedRoll = computed(() => props.rolls.find((roll) => roll.id === form.inspectionId) ?? null);
const initialResultLabel = computed(() => {
  const option = RESULT_OPTIONS.find((item) => item.value === selectedRoll.value?.initialResult);
  return option ? t(option.labelKey) : '';
});

watch(selectedRoll, (roll) => {
  if (roll?.rollLength && form.fabricLength === '') form.fabricLength = roll.rollLength;
});

const errorText = (field) => errors.value[field] ? t(`${I18N}.errors.${errors.value[field]}`) : '';

const submit = () => {
  errors.value = validateInspectionParameters(form);
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
          <label for="parameters-roll">{{ t(`${I18N}.fields.roll`) }} *</label>
          <pv-select input-id="parameters-roll" v-model="form.inspectionId" :options="rollOptions"
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
          <span>{{ t(`${I18N}.summary.receptionDate`) }}</span>
          <strong>{{ selectedRoll.inspectionDate }}</strong>
        </div>
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.summary.sample`) }}</span>
          <strong>{{ selectedRoll.sample }}</strong>
        </div>
        <div class="inspection-roll-summary-item">
          <span>{{ t(`${I18N}.summary.initialResult`) }}</span>
          <strong>{{ initialResultLabel }}</strong>
        </div>
      </div>
    </section>

    <section class="inspection-form-section">
      <header class="inspection-form-section-header">
        <span class="inspection-form-step">2</span>
        <div>
          <h2>{{ t(`${I18N}.parametersSection.title`) }}</h2>
          <p>{{ t(`${I18N}.parametersSection.subtitle`) }}</p>
        </div>
      </header>

      <div class="inspection-form-grid">
        <div class="inspection-field">
          <label for="shade-condition">{{ t(`${I18N}.fields.shadeCondition`) }} *</label>
          <pv-select input-id="shade-condition" v-model="form.shadeCondition" :options="shadeConditionOptions"
                     option-label="label" option-value="value" :invalid="!!errors.shadeCondition"
                     :placeholder="t(`${I18N}.placeholders.shadeCondition`)"/>
          <small v-if="errors.shadeCondition" class="inspection-field-error">{{ errorText('shadeCondition') }}</small>
        </div>

        <div class="inspection-field">
          <label for="fabric-width">{{ t(`${I18N}.fields.fabricWidth`) }} *</label>
          <div class="inspection-field-unit">
            <pv-input-text id="fabric-width" v-model="form.fabricWidth" type="number" min="0" step="any"
                           :invalid="!!errors.fabricWidth" :placeholder="t(`${I18N}.placeholders.fabricWidth`)"/>
            <span>{{ t(`${I18N}.units.width`) }}</span>
          </div>
          <small v-if="errors.fabricWidth" class="inspection-field-error">{{ errorText('fabricWidth') }}</small>
        </div>

        <div class="inspection-field">
          <label for="fabric-length">{{ t(`${I18N}.fields.fabricLength`) }} *</label>
          <div class="inspection-field-unit">
            <pv-input-text id="fabric-length" v-model="form.fabricLength" type="number" min="0" step="any"
                           :invalid="!!errors.fabricLength" :placeholder="t(`${I18N}.placeholders.fabricLength`)"/>
            <span>{{ t(`${I18N}.units.length`) }}</span>
          </div>
          <small v-if="errors.fabricLength" class="inspection-field-error">{{ errorText('fabricLength') }}</small>
        </div>

        <div class="inspection-field">
          <label for="defects-detected">{{ t(`${I18N}.fields.defectsDetected`) }} *</label>
          <pv-select input-id="defects-detected" v-model="form.defectsDetected" :options="defectOptions"
                     option-label="label" option-value="value" :invalid="!!errors.defectsDetected"
                     :placeholder="t(`${I18N}.placeholders.defectsDetected`)"/>
          <small v-if="errors.defectsDetected" class="inspection-field-error">{{ errorText('defectsDetected') }}</small>
        </div>

        <div class="inspection-field inspection-field-full">
          <label for="parameters-observations">{{ t(`${I18N}.fields.observations`) }}</label>
          <pv-textarea id="parameters-observations" v-model="form.observations" rows="3" auto-resize
                       :placeholder="t(`${I18N}.placeholders.observations`)"/>
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
