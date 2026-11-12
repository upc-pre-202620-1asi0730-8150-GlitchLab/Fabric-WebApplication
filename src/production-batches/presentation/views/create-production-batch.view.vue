
<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">
          {{ t('productionBatches.createBatch.title') }}
        </h1>
        <p class="page-subtitle">
          {{ t('productionBatches.createBatch.subtitle') }}
        </p>
      </div>

      <router-link to="/production-batches" class="back-link">
        &larr; {{ t('productionBatches.createBatch.back') }}
      </router-link>
    </div>

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
import { useI18n } from 'vue-i18n'
import { useProductionStore } from '../../application/store/production.js'

import CreateBatchForm from '../components/create-batch-form.component.vue'

const router = useRouter()
const { t } = useI18n()
const productionStore = useProductionStore()

const saving = ref(false)

const createBatch = async (form) => {
  if (!form.projectedQuantity || form.projectedQuantity <= 0) {
    alert(t('productionBatches.validation.quantity'))
    return
  }

  saving.value = true

  try {
    await productionStore.createBatch({
      garmentModel: form.garmentModel,
      projectedQuantity: form.projectedQuantity,
      deliveryDate: form.deliveryDate,
      notes: form.notes
    })

    router.push('/production-batches')

  } catch (err) {
    console.error('Error creating batch:', err)
    alert(t('productionBatches.validation.createFailure'))

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
