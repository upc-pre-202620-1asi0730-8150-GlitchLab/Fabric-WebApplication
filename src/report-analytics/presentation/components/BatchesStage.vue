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
  <div class="card stage-card">

    <div class="card-header">

      <h2>{{ t('dashboard.stages.title') }}</h2>

      <p>{{ t('dashboard.stages.subtitle') }}</p>

    </div>

    <div
        v-if="!Object.keys(productionStore.batchesByStage).length"
        class="stage-empty"
    >
      {{ t('dashboard.stages.empty') }}
    </div>

    <div
        v-else
        class="stage-list"
    >

      <div
          v-for="(quantity, stage) in productionStore.batchesByStage"
          :key="stage"
          class="stage-row"
      >

        <span>
          {{ translateStage(stage) }}
        </span>

        <strong>
          {{ quantity }}
        </strong>

      </div>

    </div>

  </div>
</template>