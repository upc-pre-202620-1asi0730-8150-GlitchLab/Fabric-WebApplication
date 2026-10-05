<script setup>
import { useProductionStore } from '../stores/production'

const productionStore = useProductionStore()
</script>

<template>
  <div class="card progress-card">

    <div class="card-header">

      <h2>
        Batch progress
      </h2>

      <p>
        Progress of current production batches
      </p>

    </div>

    <div
        v-if="!productionStore.batches.length"
        class="batch-empty"
    >
      No batches available
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
          {{ batch.id }}
        </strong>

        <span>
          {{ batch.stage }}
        </span>

        <div class="progress-bar">

          <div
              class="progress-fill"
              :style="{ width: `${batch.progress}%` }"
          ></div>

        </div>

        <small>
          {{ batch.progress }}%
        </small>

      </div>

    </div>

  </div>
</template>