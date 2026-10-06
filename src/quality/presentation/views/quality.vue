<template>
  <div class="quality-view-container">
    <header class="quality-header">
      <div class="header-left">
        <h1 class="page-title">Quality</h1>
        <p class="page-description">
          Manage fabric inspections, quality tests and garment defects.
        </p>
      </div>

      <div class="header-right">
        <button class="btn-dashboard-shortcut" @click="goToDashboard">
          &larr; Back to Dashboard
        </button>
      </div>
    </header>

    <div class="tabs-bar">
      <button
          class="tab-btn"
          :class="{ active: currentTab === 'fabric' }"
          @click="currentTab = 'fabric'"
      >
        Fabric
      </button>
      <button
          class="tab-btn"
          :class="{ active: currentTab === 'defects' }"
          @click="currentTab = 'defects'"
      >
        Defects
      </button>
    </div>

    <div v-if="currentTab === 'defects'" class="quality-grid">
      <section class="left-panel">
        <RegisterDefectForm @register-defect="handleRegisterDefect" />
      </section>

      <section class="right-panel">
        <div class="panel-card">
          <ObservedGarmentsTable
              :defects="defectList"
              :selected-defect="activeDefect"
              @select-defect="selectDefect"
          />

          <DefectDispositionCard
              v-if="activeDefect"
              :defect="activeDefect"
              @apply-disposition="handleApplyDisposition"
          />
        </div>
      </section>
    </div>

    <div v-else class="fabric-placeholder-panel">
      <p>Fabric inspections module (Under development by group members).</p>
      <button class="tab-btn active" @click="currentTab = 'defects'">
        Return to Defects
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RegisterDefectForm from '../components/RegisterDefectForm.vue';
import ObservedGarmentsTable from '../components/ObservedGarmentsTable.vue';
import DefectDispositionCard from '../components/DefectDispositionCard.vue';
import { DefectRecord } from '../../domain/model/defect.model.js';

const router = useRouter();
const currentTab = ref('defects');

const defectList = ref([
  new DefectRecord({
    id: 'DEF-031',
    batchId: 'LOT-024 — T-Shirt Basic',
    defectType: 'Open stitches',
    quantity: 6,
    machineId: 'MC-014 — Overlock',
    origin: 'Machine',
    status: 'Pending Decision'
  }),
  new DefectRecord({
    id: 'DEF-032',
    batchId: 'LOT-024 — T-Shirt Basic',
    defectType: 'Torn fabric',
    quantity: 2,
    machineId: 'MC-014 — Overlock',
    origin: 'Fabric',
    status: 'Pending Decision'
  })
]);

const activeDefect = ref(defectList.value[0]);

const selectDefect = (defect) => {
  activeDefect.value = defect;
};

const handleRegisterDefect = (newDefectData) => {
  const nextIdNumber = defectList.value.length + 31;
  const newId = `DEF-0${nextIdNumber}`;

  const createdDefect = new DefectRecord({
    id: newId,
    batchId: newDefectData.batchId,
    defectType: newDefectData.defectType,
    quantity: newDefectData.quantity,
    machineId: newDefectData.machineId,
    origin: newDefectData.origin,
    status: newDefectData.status,
    observation: newDefectData.observation
  });

  defectList.value.push(createdDefect);
  activeDefect.value = createdDefect;
};

const handleApplyDisposition = ({ defectId, disposition, correction, quantity }) => {
  const target = defectList.value.find((d) => d.id === defectId);
  if (target) {
    target.disposition = disposition;
    target.correctionType = correction;
    target.status = disposition;
    alert(`Disposition confirmed: ${disposition} for ${quantity} garments in ${defectId}.`);
  }
};

const goToDashboard = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.quality-view-container {
  padding: 32px 40px;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
}
.quality-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
}
.page-description {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #8892a0;
  margin: 0;
}
.btn-dashboard-shortcut {
  background: transparent;
  border: 1px solid #eaeaea;
  padding: 8px 16px;
  border-radius: 8px;
  color: #485320;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-dashboard-shortcut:hover {
  background-color: #f5f7fa;
  border-color: #485320;
}

.tabs-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}
.tab-btn {
  padding: 8px 28px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid #eaeaea;
  background-color: #ffffff;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background-color: #485320;
  border-color: #485320;
  color: #ffffff;
}

.quality-grid {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 28px;
  align-items: start;
}
.panel-card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.fabric-placeholder-panel {
  padding: 48px;
  text-align: center;
  color: #8892a0;
  border: 2px dashed #eaeaea;
  border-radius: 12px;
}
</style>