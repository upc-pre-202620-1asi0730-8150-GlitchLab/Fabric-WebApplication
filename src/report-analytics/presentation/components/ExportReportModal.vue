<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits([
  'close',
  'export'
])

const reportType = ref('Production & Quality')

const startDate = ref('2026-10-01')
const endDate = ref('2026-10-31')

const selectedBatch = ref('All batches')

const format = ref('pdf')

const include = ref({
  productionSummary: true,
  batchProductivity: true,
  machineDowntime: true,
  qualityIndicators: true,
  defectsRework: true,
  waste: true
})

const exportReport = () => {

  emit('export', {

    reportType: reportType.value,

    startDate: startDate.value,

    endDate: endDate.value,

    batch: selectedBatch.value,

    include: include.value,

    format: format.value

  })

}
</script>

<template>

  <div
      class="modal-overlay"
      @click.self="emit('close')"
  >

    <div class="export-modal">

      <div class="modal-header">

        <div>

          <h2>
            {{ t('dashboard.export.title') }}
          </h2>

          <p>
            {{ t('dashboard.export.subtitle') }}
          </p>

        </div>

        <button
            class="modal-close"
            @click="emit('close')"
        >
          ×
        </button>

      </div>


      <div class="modal-body">

        <div class="form-row">

          <div class="form-group">

            <label>
              {{ t('dashboard.export.reportType') }}
            </label>

            <select v-model="reportType">

              <option value="Production & Quality">{{ t('dashboard.export.productionQuality') }}</option>

              <option value="Production">{{ t('dashboard.export.production') }}</option>

              <option value="Quality">{{ t('dashboard.export.quality') }}</option>

            </select>

          </div>


          <div class="form-group">

            <label>
              {{ t('dashboard.export.period') }}
            </label>

            <div class="date-range">

              <input
                  v-model="startDate"
                  type="date"
              >

              <span>
                –
              </span>

              <input
                  v-model="endDate"
                  type="date"
              >

            </div>

          </div>

        </div>


        <div class="form-group">

          <label>
            {{ t('dashboard.batch') }}
          </label>

          <select v-model="selectedBatch">

            <option value="All batches">{{ t('dashboard.allBatches') }}</option>

            <option>
              LOT-024
            </option>

            <option>
              LOT-023
            </option>

            <option>
              LOT-022
            </option>

          </select>

        </div>


        <div class="form-group">

          <label>
            {{ t('dashboard.export.include') }}
          </label>

          <div class="checkbox-grid">

            <label class="checkbox-item">

              <input
                  v-model="include.productionSummary"
                  type="checkbox"
              >

              <span>
                {{ t('dashboard.export.productionSummary') }}
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.qualityIndicators"
                  type="checkbox"
              >

              <span>
                {{ t('dashboard.export.qualityIndicators') }}
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.batchProductivity"
                  type="checkbox"
              >

              <span>
                {{ t('dashboard.export.batchProductivity') }}
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.defectsRework"
                  type="checkbox"
              >

              <span>
                {{ t('dashboard.export.defectsRework') }}
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.machineDowntime"
                  type="checkbox"
              >

              <span>
                {{ t('dashboard.export.machineDowntime') }}
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.waste"
                  type="checkbox"
              >

              <span>
                {{ t('dashboard.export.waste') }}
              </span>

            </label>

          </div>

        </div>


        <div class="form-group">

          <label>
            {{ t('dashboard.export.format') }}
          </label>

          <div class="format-options">

            <label class="radio-item">

              <input
                  v-model="format"
                  type="radio"
                  value="pdf"
              >

              <span>
                {{ t('dashboard.export.pdf') }}
              </span>

            </label>


            <label class="radio-item">

              <input
                  v-model="format"
                  type="radio"
                  value="excel"
              >

              <span>
                {{ t('dashboard.export.excel') }}
              </span>

            </label>

          </div>

        </div>

      </div>


      <div class="modal-footer">

        <button
            class="cancel-button"
            @click="emit('close')"
        >
          {{ t('dashboard.export.cancel') }}
        </button>

        <button
            class="export-button"
            @click="exportReport"
        >
          {{ t('dashboard.export.submit') }}
        </button>

      </div>

    </div>

  </div>

</template>