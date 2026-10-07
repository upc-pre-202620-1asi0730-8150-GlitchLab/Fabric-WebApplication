<template>
  <div class="page-container" v-if="batch">
    <div class="page-header">
      <div>
        <h1 class="page-title">Batch Observations</h1>
        <p class="page-subtitle">Register and review notes associated with a production batch.</p>
      </div>
      <router-link to="/production-batches" class="back-link">&larr; Back to Production Batches</router-link>
    </div>

    <!-- Info Card -->
    <div class="info-card">
      <div class="info-grid">
        <div><span class="info-label">Batch ID</span><span class="info-value">{{ batch.batchNumber }}</span></div>
        <div><span class="info-label">Garment Model</span><span class="info-value">{{ batch.garmentModel }}</span></div>
        <div><span class="info-label">Current Stage</span><span class="info-value">{{ batch.currentStage }}</span></div>
      </div>
    </div>

    <!-- Add Observation Card -->
    <div class="card">
      <h3 class="card-title">Add Observation</h3>
      <p class="card-subtitle">Document incidents or agreements that are not formal defects.</p>

      <div class="form-group mb-16">
        <label>Observation *</label>
        <textarea v-model="newObsText" rows="3" placeholder="Write an observation about this production batch..." class="custom-textarea"></textarea>
      </div>

      <div class="card-footer">
        <span class="help-text">Empty text or spaces only &rarr; observation cannot be saved.</span>
        <button class="btn-olive" :disabled="!newObsText.trim()" @click="addObservation">Save Observation</button>
      </div>
    </div>

    <!-- Timeline Card -->
    <div class="card">
      <h3 class="card-title">Observation History</h3>
      <p class="card-subtitle">Most recent observations appear first.</p>

      <div class="timeline">
        <div v-for="(obs, index) in observations" :key="obs.id">
          <div class="timeline-item">
            <div class="dot"></div>
            <div class="timeline-content">
              <span class="timestamp">{{ obs.timestamp }}</span>
              <p class="obs-text">{{ obs.text }}</p>
              <span v-if="obs.author" class="author">{{ obs.author }}</span>
            </div>
          </div>
          <div v-if="index < observations.length - 1" class="timeline-divider"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const batch = ref(null)
const observations = ref([])
const newObsText = ref('')

const fetchData = async () => {
  try {
    const batchRes = await fetch(`http://localhost:3000/batches/${route.params.id}`)
    batch.value = await batchRes.json()

    const obsRes = await fetch(`http://localhost:3000/observations?batchId=${route.params.id}`)
    observations.value = await obsRes.json()
  } catch (err) {
    console.error('Error fetching observations:', err)
  }
}

onMounted(fetchData)

const addObservation = async () => {
  if (!newObsText.value.trim()) return

  const now = new Date()
  const timestamp = `${now.toLocaleDateString()} · ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

  const newObs = {
    batchId: route.params.id,
    timestamp,
    text: newObsText.value.trim(),
    author: 'Registered by Supervisor'
  }

  try {
    const res = await fetch('http://localhost:3000/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newObs)
    })
    const savedObs = await res.json()
    observations.value.unshift(savedObs)
    newObsText.value = ''
  } catch (err) {
    console.error('Error adding observation:', err)
  }
}
</script>

<style scoped>
.page-container { padding: 32px 40px; background: #ffffff; font-family: system-ui, sans-serif; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.back-link { font-size: 14px; color: #6B7280; text-decoration: none; }

.info-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; }
.info-grid { display: flex; gap: 60px; }
.info-label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.info-value { font-size: 15px; font-weight: 700; color: #111827; }

.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 20px 0; }

.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.custom-textarea { width: 100%; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; font-size: 14px; box-sizing: border-box; }
.mb-16 { margin-bottom: 16px; }

.card-footer { display: flex; justify-content: space-between; align-items: center; }
.help-text { font-size: 12px; color: #9CA3AF; }

.btn-olive { background: #48532B; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-olive:disabled { background-color: #A3A3A3; cursor: not-allowed; }

.timeline { display: flex; flex-direction: column; gap: 16px; }
.timeline-item { display: flex; gap: 12px; align-items: flex-start; }
.dot { width: 10px; height: 10px; background-color: #48532B; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.timestamp { font-size: 13px; font-weight: 700; color: #111827; display: block; margin-bottom: 4px; }
.obs-text { font-size: 14px; color: #374151; margin: 0 0 4px 0; }
.author { font-size: 12px; color: #9CA3AF; }
.timeline-divider { border-top: 1px solid #F3F4F6; margin: 8px 0; }
</style>