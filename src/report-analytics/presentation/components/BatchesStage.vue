<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STAGE_LABEL_KEYS } from '../stage-labels.js'

const props = defineProps({
  batches: { type: Array, default: () => [] }
})

const { t } = useI18n()

const batchesByStage = computed(() => props.batches.reduce((acc, batch) => {
  const stage = batch.currentStage || 'Unknown'
  acc[stage] = (acc[stage] || 0) + 1
  return acc
}, {}))

const translateStage = (stage) => STAGE_LABEL_KEYS[stage] ? t(STAGE_LABEL_KEYS[stage]) : stage
</script>

<template>
  <div class="report-card report-stage-card">
    <div class="report-card-header">
      <h2>{{ t('dashboard.stages.title') }}</h2>
      <p>{{ t('dashboard.stages.subtitle') }}</p>
    </div>

    <div v-if="!Object.keys(batchesByStage).length" class="report-empty">
      {{ t('dashboard.stages.empty') }}
    </div>

    <div v-else class="report-stage-list">
      <div v-for="(quantity, stage) in batchesByStage" :key="stage" class="report-stage-row">
        <span>{{ translateStage(stage) }}</span>
        <strong>{{ quantity }}</strong>
      </div>
    </div>
  </div>
</template>
