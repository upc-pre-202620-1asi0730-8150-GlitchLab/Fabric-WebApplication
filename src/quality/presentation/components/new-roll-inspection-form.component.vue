<script setup>
import {computed, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import {
  INSPECTION_RESULT,
  SHADE_MATCH,
  validateFabricInspection,
  WEAVE_CONDITION
} from "../../domain/model/fabric-inspection.js";
import {RESULT_OPTIONS, SHADE_MATCH_OPTIONS, WEAVE_CONDITION_OPTIONS} from "../inspection-options.js";

defineProps({
  suppliers: {type: Array, default: () => []},
  samples: {type: Array, default: () => []},
  saving: {type: Boolean, default: false}
});
const emit = defineEmits(['save']);

const {t} = useI18n();
const I18N = 'qualityInspector.newInspection';

const emptyForm = () => ({
  rollId: '',
  supplier: null,
  inspectionDate: new Date().toISOString().split('T')[0],
  sample: null,
  color: '',
  rollLength: '',
  shadeMatch: SHADE_MATCH.MATCHES,
  weaveCondition: WEAVE_CONDITION.NO_HOLES,
  initialResult: INSPECTION_RESULT.CONFORMING,
  observation: ''
});

const form = reactive(emptyForm());
const errors = ref({});

const translate = (options) => options.map(({value, labelKey}) => ({value, label: t(labelKey)}));
const shadeMatchOptions = computed(() => translate(SHADE_MATCH_OPTIONS));
const weaveConditionOptions = computed(() => translate(WEAVE_CONDITION_OPTIONS));
const resultOptions = computed(() => translate(RESULT_OPTIONS));

const isObserved = computed(() => form.initialResult === INSPECTION_RESULT.OBSERVED);

const errorText = (field) => errors.value[field] ? t(`${I18N}.errors.${errors.value[field]}`) : '';

const submit = () => {
  errors.value = validateFabricInspection(form);
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
          <h2>{{ t(`${I18N}.rollInfo.title`) }}</h2>
          <p>{{ t(`${I18N}.rollInfo.subtitle`) }}</p>
        </div>
      </header>

      <div class="inspection-form-grid">
        <div class="inspection-field">
          <label for="roll-id">{{ t(`${I18N}.fields.rollId`) }} *</label>
          <pv-input-text id="roll-id" v-model="form.rollId" :invalid="!!errors.rollId"
                         :placeholder="t(`${I18N}.placeholders.rollId`)"/>
          <small v-if="errors.rollId" class="inspection-field-error">{{ errorText('rollId') }}</small>
        </div>

        <div class="inspection-field">
          <label for="supplier">{{ t(`${I18N}.fields.supplier`) }} *</label>
          <pv-select input-id="supplier" v-model="form.supplier" :options="suppliers"
                     option-label="name" option-value="name" :invalid="!!errors.supplier"
                     :placeholder="t(`${I18N}.placeholders.supplier`)"/>
          <small v-if="errors.supplier" class="inspection-field-error">{{ errorText('supplier') }}</small>
        </div>

        <div class="inspection-field">
          <label for="reception-date">{{ t(`${I18N}.fields.receptionDate`) }} *</label>
          <pv-input-text id="reception-date" v-model="form.inspectionDate" type="date"
                         :invalid="!!errors.inspectionDate"/>
          <small v-if="errors.inspectionDate" class="inspection-field-error">{{ errorText('inspectionDate') }}</small>
        </div>

        <div class="inspection-field">
          <label for="sample">{{ t(`${I18N}.fields.sample`) }} *</label>
          <pv-select input-id="sample" v-model="form.sample" :options="samples"
                     option-label="name" option-value="name" :invalid="!!errors.sample"
                     :placeholder="t(`${I18N}.placeholders.sample`)"/>
          <small v-if="errors.sample" class="inspection-field-error">{{ errorText('sample') }}</small>
        </div>

        <div class="inspection-field">
          <label for="color">{{ t(`${I18N}.fields.color`) }} *</label>
          <pv-input-text id="color" v-model="form.color" :invalid="!!errors.color"
                         :placeholder="t(`${I18N}.placeholders.color`)"/>
          <small v-if="errors.color" class="inspection-field-error">{{ errorText('color') }}</small>
        </div>

        <div class="inspection-field">
          <label for="roll-length">{{ t(`${I18N}.fields.rollLength`) }}</label>
          <div class="inspection-field-unit">
            <pv-input-text id="roll-length" v-model="form.rollLength" type="number" min="0" step="any"
                           :invalid="!!errors.rollLength" :placeholder="t(`${I18N}.placeholders.rollLength`)"/>
            <span>{{ t(`${I18N}.lengthUnit`) }}</span>
          </div>
          <small v-if="errors.rollLength" class="inspection-field-error">{{ errorText('rollLength') }}</small>
        </div>
      </div>
    </section>

    <section class="inspection-form-section">
      <header class="inspection-form-section-header">
        <span class="inspection-form-step">2</span>
        <div>
          <h2>{{ t(`${I18N}.initialInspection.title`) }}</h2>
          <p>{{ t(`${I18N}.initialInspection.subtitle`) }}</p>
        </div>
      </header>

      <div class="inspection-form-grid">
        <div class="inspection-field">
          <label for="shade-match">{{ t(`${I18N}.fields.shadeMatch`) }} *</label>
          <pv-select input-id="shade-match" v-model="form.shadeMatch" :options="shadeMatchOptions"
                     option-label="label" option-value="value"/>
        </div>

        <div class="inspection-field">
          <label for="weave-condition">{{ t(`${I18N}.fields.weaveCondition`) }} *</label>
          <pv-select input-id="weave-condition" v-model="form.weaveCondition" :options="weaveConditionOptions"
                     option-label="label" option-value="value"/>
        </div>

        <div class="inspection-field">
          <label for="initial-result">{{ t(`${I18N}.fields.result`) }} *</label>
          <pv-select input-id="initial-result" v-model="form.initialResult" :options="resultOptions"
                     option-label="label" option-value="value" :invalid="!!errors.initialResult"/>
          <small v-if="errors.initialResult" class="inspection-field-error">{{ errorText('initialResult') }}</small>
        </div>

        <div class="inspection-field inspection-field-full">
          <label for="observation">{{ t(`${I18N}.fields.observation`) }}</label>
          <pv-textarea id="observation" v-model="form.observation" rows="3" auto-resize
                       :invalid="!!errors.observation" :placeholder="t(`${I18N}.placeholders.observation`)"/>
          <small v-if="errors.observation" class="inspection-field-error">{{ errorText('observation') }}</small>
        </div>
      </div>
    </section>

    <footer class="inspection-form-footer">
      <p class="inspection-form-banner" :class="{'inspection-form-banner-blocked': isObserved}">
        {{ isObserved ? t(`${I18N}.hints.blocked`) : t(`${I18N}.hints.available`) }}
      </p>

      <div class="inspection-form-actions">
        <pv-button type="button" :label="t(`${I18N}.actions.clear`)" icon="pi pi-eraser"
                   severity="secondary" outlined @click="reset"/>
        <pv-button type="submit" class="inspection-submit" :label="t(`${I18N}.actions.save`)"
                   icon="pi pi-check" :loading="saving"/>
      </div>
    </footer>
  </form>
</template>
