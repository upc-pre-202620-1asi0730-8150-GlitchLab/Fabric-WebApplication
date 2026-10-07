<script setup>
import { ref } from 'vue'

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
            Export Production & Quality Report
          </h2>

          <p>
            Select the period, information and format for your report.
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
              Report type
            </label>

            <select v-model="reportType">

              <option>
                Production & Quality
              </option>

              <option>
                Production
              </option>

              <option>
                Quality
              </option>

            </select>

          </div>


          <div class="form-group">

            <label>
              Period
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
            Batch
          </label>

          <select v-model="selectedBatch">

            <option>
              All batches
            </option>

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
            Include in the report
          </label>

          <div class="checkbox-grid">

            <label class="checkbox-item">

              <input
                  v-model="include.productionSummary"
                  type="checkbox"
              >

              <span>
                Production summary
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.qualityIndicators"
                  type="checkbox"
              >

              <span>
                Quality indicators
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.batchProductivity"
                  type="checkbox"
              >

              <span>
                Batch productivity
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.defectsRework"
                  type="checkbox"
              >

              <span>
                Defects and rework
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.machineDowntime"
                  type="checkbox"
              >

              <span>
                Machine downtime
              </span>

            </label>


            <label class="checkbox-item">

              <input
                  v-model="include.waste"
                  type="checkbox"
              >

              <span>
                Waste
              </span>

            </label>

          </div>

        </div>


        <div class="form-group">

          <label>
            Format
          </label>

          <div class="format-options">

            <label class="radio-item">

              <input
                  v-model="format"
                  type="radio"
                  value="pdf"
              >

              <span>
                PDF
              </span>

            </label>


            <label class="radio-item">

              <input
                  v-model="format"
                  type="radio"
                  value="excel"
              >

              <span>
                Excel (.xlsx)
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
          Cancel
        </button>

        <button
            class="export-button"
            @click="exportReport"
        >
          Export Report
        </button>

      </div>

    </div>

  </div>

</template>