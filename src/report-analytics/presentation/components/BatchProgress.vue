<script setup>
import { useI18n } from 'vue-i18n'
import { STAGE_LABEL_KEYS } from '../stage-labels.js'

defineProps({
  batches: { type: Array, default: () => [] }
})

const { t } = useI18n()

const translateStage = (stage) => STAGE_LABEL_KEYS[stage] ? t(STAGE_LABEL_KEYS[stage]) : stage
</script>

<template>
  <div class="report-card report-progress-card">
    <div class="report-card-header">
      <h2>{{ t('dashboard.progress.title') }}</h2>
      <p>{{ t('dashboard.progress.subtitle') }}</p>
    </div>

    <div v-if="!batches.length" class="report-empty">
      {{ t('dashboard.progress.empty') }}
    </div>

    <div v-else class="report-batch-list">
      <div v-for="batch in batches" :key="batch.id" class="report-batch-row">
        <strong>{{ batch.batchNumber }}</strong>
        <span>{{ translateStage(batch.currentStage) }}</span>
        <div class="report-progress-bar">
          <div class="report-progress-fill" :style="{ width: `${batch.progressPercentage}%` }"></div>
        </div>
        <small>{{ batch.progressPercentage }}%</small>
      </div>
    </div>
  </div>
</template>
