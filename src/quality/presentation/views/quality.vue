<template>
  <div class="quality-container">
    <AddEvidenceView
        v-if="currentView === 'evidence' && selectedDefectForEvidence"
        :defect="selectedDefectForEvidence"
        @back="currentView = 'defects'"
        @save-evidence="handleSaveEvidence"
    />

    <div v-else>
      <header class="header">
        <div>
          <h1 class="page-title">Quality</h1>
          <p class="page-subtitle">Manage fabric inspections, quality tests and garment defects.</p>
        </div>
      </header>

      <div class="tabs">
        <button
            class="tab"
            :class="{ active: currentTab === 'fabric' }"
            @click="currentTab = 'fabric'"
        >
          Fabric
        </button>
        <button
            class="tab"
            :class="{ active: currentTab === 'defects' }"
            @click="currentTab = 'defects'"
        >
          Defects
        </button>
      </div>

      <div v-if="currentTab === 'defects'" class="layout-grid">
        <section class="left-col">
          <RegisterDefectForm @create-defect="handleCreateDefect" />
        </section>

        <section class="right-col">
          <div class="panel-card">
            <ObservedGarmentsTable
                :defects="defectList"
                :selected-defect="activeDefect"
                @select-defect="selectDefect"
                @navigate-to-evidence="goToEvidenceView"
            />

            <DefectDispositionCard
                v-if="activeDefect"
                :defect="activeDefect"
                @confirm-disposition="handleConfirmDisposition"
            />
          </div>
        </section>
      </div>

      <div v-else class="empty-tab">
        <p>Fabric inspections module (Under development by group members).</p>
        <button class="tab active" @click="currentTab = 'defects'">Return to Defects</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RegisterDefectForm from '../components/RegisterDefectForm.vue'
import ObservedGarmentsTable from '../components/ObservedGarmentsTable.vue'
import DefectDispositionCard from '../components/DefectDispositionCard.vue'
import AddEvidenceView from './AddEvidenceView.vue'
import { DefectService } from '../../infrastructure/defect.service.js'

const currentView = ref('defects')
const currentTab = ref('defects')
const defectList = ref([])
const activeDefect = ref(null)
const selectedDefectForEvidence = ref(null)

const loadDefects = async () => {
  const data = await DefectService.getAll()
  defectList.value = data
  if (data.length > 0 && !activeDefect.value) {
    activeDefect.value = data[0]
  }
}

onMounted(() => {
  loadDefects()
})

const selectDefect = (item) => {
  activeDefect.value = item
}

const goToEvidenceView = (item) => {
  selectedDefectForEvidence.value = item
  currentView.value = 'evidence'
}

const handleSaveEvidence = async ({ defectId, evidences }) => {
  await DefectService.update(defectId, { evidences })
  await loadDefects()
  currentView.value = 'defects'
}

const handleCreateDefect = async (formData) => {
  const newDefect = {
    id: `DEF-0${defectList.value.length + 31}`,
    batchId: formData.batchId.split(' ')[0],
    defectType: formData.defectType,
    quantity: formData.quantity,
    machineId: formData.machineId,
    origin: formData.origin,
    status: formData.status,
    observation: formData.observation,
    garmentModel: formData.batchId.split('—')[1]?.trim() || 'T-Shirt Basic',
    date: 'Sep 16, 2026',
    evidences: []
  }

  await DefectService.create(newDefect)
  await loadDefects()
  activeDefect.value = newDefect
}

const handleConfirmDisposition = async ({ defectId, decision, correction }) => {
  await DefectService.update(defectId, {
    status: decision,
    disposition: decision,
    correctionType: correction
  })
  await loadDefects()
}
</script>

<style scoped>
.quality-container {
  padding: 32px 40px;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
}
.header {
  margin-bottom: 24px;
}
.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
}
.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #8892a0;
  margin: 0;
}
.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}
.tab {
  padding: 8px 36px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #eaeaea;
  background-color: #ffffff;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s;
}
.tab.active {
  background-color: #485320;
  border-color: #485320;
  color: #ffffff;
}
.layout-grid {
  display: grid;
  grid-template-columns: 410px 1fr;
  gap: 24px;
  align-items: start;
}
.panel-card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 14px;
  padding: 24px;
}
.empty-tab {
  padding: 60px;
  text-align: center;
  color: #8892a0;
  border: 2px dashed #eaeaea;
  border-radius: 12px;
}
</style>