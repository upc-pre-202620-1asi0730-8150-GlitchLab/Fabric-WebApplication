<script setup>
import { useProductionStore } from '../../../stores/production.js'
import { useI18n } from 'vue-i18n'

const productionStore = useProductionStore()
const { t } = useI18n()

const translateStage = (stage) => {
  const stageKeys = {
    Cutting: 'dashboard.stages.cutting',
    Sewing: 'dashboard.stages.sewing',
    Finishing: 'dashboard.stages.finishing',
    Unknown: 'dashboard.stages.unknown'
  }
  return stageKeys[stage] ? t(stageKeys[stage]) : stage
}
</script>

<template>
  <div class="card progress-card">

    <div class="card-header">

      <h2>{{ t('dashboard.progress.title') }}</h2>

      <p>{{ t('dashboard.progress.subtitle') }}</p>

    </div>

    <div
        v-if="!productionStore.batches.length"
        class="batch-empty"
    >
      {{ t('dashboard.progress.empty') }}
    </div>

    <div
        v-else
        class="batch-list"
    >

      <div
          v-for="batch in productionStore.batches"
          :key="batch.id"
          class="batch-row"
      >

        <strong>
          {{ batch.batchNumber }}
        </strong>

        <span>
          {{ translateStage(batch.currentStage) }}
        </span>

        <div class="progress-bar">

          <div
              class="progress-fill"
              :style="{ width: `${batch.progressPercentage}%` }"
          ></div>

        </div>

        <small>
          {{ batch.progressPercentage }}%
        </small>

      </div>

    </div>

  </div>
</template>