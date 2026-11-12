<template>
  <div class="batch-defects-card">
    <h3 class="batch-defects-title">{{ t('productionBatches.defects.title') }}</h3>
    <p class="batch-defects-subtitle">{{ t('productionBatches.defects.subtitle') }}</p>

    <p v-if="!defects.length" class="batch-defects-empty">{{ t('productionBatches.defects.empty') }}</p>

    <table v-else class="batch-defects-table">
      <thead>
        <tr>
          <th>{{ t('productionBatches.defects.columns.type') }}</th>
          <th>{{ t('productionBatches.defects.columns.quantity') }}</th>
          <th>{{ t('productionBatches.defects.columns.origin') }}</th>
          <th>{{ t('productionBatches.defects.columns.status') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="defect in defects" :key="defect.id">
          <td>{{ defect.defectType }}</td>
          <td>{{ defect.quantity }}</td>
          <td>{{ defect.origin }}</td>
          <td>{{ defect.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DefectService } from '../../../quality/infrastructure/defect.service.js'

const props = defineProps({
  batchNumber: { type: String, required: true }
})

const { t } = useI18n()
const defects = ref([])

const loadDefects = async () => {
  try {
    defects.value = await DefectService.getAll(props.batchNumber)
  } catch (err) {
    console.error('Error loading batch defects:', err)
    defects.value = []
  }
}

watch(() => props.batchNumber, loadDefects, { immediate: true })
</script>
