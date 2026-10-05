<script setup>
import { useProductionStore } from '../stores/production'

const productionStore = useProductionStore()
</script>

<template>
  <div class="card stage-card">

    <div class="card-header">

      <h2>
        Batches by stage
      </h2>

      <p>
        Current operational stage
      </p>

    </div>

    <div
        v-if="!Object.keys(productionStore.batchesByStage).length"
        class="stage-empty"
    >
      No batches available
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
          {{ stage }}
        </span>

        <strong>
          {{ quantity }}
        </strong>

      </div>

    </div>

  </div>
</template>