
<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          {{ $t('productionBatches.createBatch.title') }}
        </h1>
        <p class="page-subtitle">
          {{ $t('productionBatches.createBatch.subtitle') }}
        </p>
      </div>

      <router-link to="/production-batches" class="back-link">
        &larr; {{ $t('productionBatches.createBatch.back') }}
      </router-link>
    </div>

    <!-- Reusable Form Component -->
    <CreateBatchForm
        :saving="saving"
        @save="createBatch"
        @cancel="router.push('/production-batches')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductionStore } from '../../../stores/production.js'

import CreateBatchForm from '../components/create-batch-form.component.vue'

const router = useRouter()
const productionStore = useProductionStore()

const saving = ref(false)

const createBatch = async (form) => {
  if (!form.projectedQuantity || form.projectedQuantity <= 0) {
    alert('Projected quantity must be greater than 0.')
    return
  }

  saving.value = true

  try {
    // Load current batches to prevent LOT number collisions
    await productionStore.fetchBatches()

    if (productionStore.error) {
      throw new Error(productionStore.error)
    }

    // Create the new production batch
    await productionStore.createBatch({
      batchNumber: productionStore.nextBatchNumber,
      garmentModel: form.garmentModel,
      projectedQuantity: form.projectedQuantity,
      currentStage: 'Cutting',
      progressPercentage: 10,
      deliveryDate: form.deliveryDate,
      status: 'In Production',
      notes: form.notes
    })

    // Return to production batches list
    router.push('/production-batches')

  } catch (err) {
    console.error('Error creating batch:', err)
    alert('Could not create the batch. Please try again.')

  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-container {
  padding: 32px 40px;
  background-color: #ffffff;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.page-subtitle {
  font-size: 14px;
  color: #6B7280;
  margin-top: 4px;
}

.back-link {
  font-size: 14px;
  color: #6B7280;
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 640px) {
  .page-container {
    padding: 24px 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
