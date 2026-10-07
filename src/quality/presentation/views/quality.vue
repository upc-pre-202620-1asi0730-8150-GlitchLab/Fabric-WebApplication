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

      <p v-if="errorMessage" style="color:#B91C1C;margin-bottom:12px">{{ errorMessage }}</p>

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
          <RegisterDefectForm @register-defect="handleCreateDefect" />
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
                @apply-disposition="handleConfirmDisposition"
            />
          </div>
        </section>
      </div>

      <div v-else><FabricInspections /></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RegisterDefectForm from '../components/RegisterDefectForm.vue'
import ObservedGarmentsTable from '../components/ObservedGarmentsTable.vue'
import DefectDispositionCard from '../components/DefectDispositionCard.vue'
import AddEvidenceView from './AddEvidenceView.vue'
import FabricInspections from '../components/fabricInspections.vue'
import { DefectService } from '../../infrastructure/defect.service.js'

const currentView = ref('defects')
const currentTab = ref('defects')
const defectList = ref([])
const activeDefect = ref(null)
const selectedDefectForEvidence = ref(null)
const errorMessage = ref('')

const loadDefects = async () => {
  try {
    errorMessage.value = ''
    const data = await DefectService.getAll()
    defectList.value = data
    if (activeDefect.value) {
      activeDefect.value = data.find(d => d.id === activeDefect.value.id) || null
    }
    if (data.length > 0 && !activeDefect.value) {
      activeDefect.value = data[0]
    }
  } catch (err) {
    console.error('Error loading defects:', err)
    errorMessage.value = 'Could not load defects from the server.'
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

const nextDefectId = () => {
  const max = defectList.value
      .map(d => parseInt(String(d.id).replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n))
      .reduce((m, n) => Math.max(m, n), 30)
  return `DEF-${String(max + 1).padStart(3, '0')}`
}

const handleSaveEvidence = async ({ defectId, evidences }) => {
  try {
    await DefectService.update(defectId, { evidences })
    await loadDefects()
    currentView.value = 'defects'
  } catch (err) {
    console.error('Error saving evidence:', err)
    errorMessage.value = 'Could not save the evidence.'
    currentView.value = 'defects'
  }
}

const handleCreateDefect = async (formData) => {
  const newDefect = {
    id: nextDefectId(),
    batchId: formData.batchId.split(' ')[0],
    defectType: formData.defectType,
    quantity: formData.quantity,
    machineId: formData.machineId,
    origin: formData.origin,
    status: formData.status,
    observation: formData.observation,
    garmentModel: formData.batchId.split('—')[1]?.trim() || 'T-Shirt Basic',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    evidences: []
  }

  try {
    const created = await DefectService.create(newDefect)
    activeDefect.value = created
    await loadDefects()
  } catch (err) {
    console.error('Error creating defect:', err)
    errorMessage.value = 'Could not register the defect.'
  }
}

// DefectDispositionCard emits: { defectId, disposition, correction, quantity }
const handleConfirmDisposition = async ({ defectId, disposition, correction }) => {
  try {
    await DefectService.update(defectId, {
      status: disposition,
      disposition,
      correctionType: correction
    })
    await loadDefects()
  } catch (err) {
    console.error('Error applying disposition:', err)
    errorMessage.value = 'Could not apply the disposition.'
  }
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