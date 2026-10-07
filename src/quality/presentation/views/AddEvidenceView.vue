<template>
  <div class="add-evidence-page" v-if="defect">
    <button type="button" class="back-link" @click="$emit('back')">
      &larr; Back to Defects
    </button>

    <header class="page-header">
      <h1 class="page-title">Add Evidence</h1>
      <p class="page-subtitle">Attach and register evidence for the detected garment defect.</p>
    </header>

    <div class="evidence-grid">
      <div class="col-left">
        <div class="card defect-info-card">
          <h2 class="card-title">Defect Information</h2>

          <div class="highlight-box">
            <div>
              <span class="label">Defect ID</span>
              <span class="value-id font-mono">{{ defect.id }}</span>
            </div>
            <div class="text-right">
              <span class="label">Status</span>
              <span class="badge badge-pending">{{ defect.status }}</span>
            </div>
          </div>

          <div class="meta-grid">
            <div>
              <span class="label">Batch</span>
              <span class="value font-mono">{{ defect.batchId }}</span>
            </div>
            <div>
              <span class="label">Defect Type</span>
              <span class="value font-bold">{{ defect.defectType }}</span>
            </div>
            <div>
              <span class="label">Quantity</span>
              <span class="value font-mono font-bold">{{ defect.quantity }}</span>
            </div>
            <div>
              <span class="label">Associated Machine</span>
              <span class="value">{{ defect.machineId }}</span>
            </div>
            <div class="full-row">
              <span class="label">Garment</span>
              <span class="value font-bold">{{ defect.garmentModel || 'T-Shirt Basic' }}</span>
            </div>
          </div>
        </div>

        <div class="card form-card">
          <h2 class="card-title">Evidence Details</h2>

          <div class="fields-row">
            <div class="field-item flex-1">
              <label>Evidence Type *</label>
              <div class="select-box">
                <select v-model="form.type">
                  <option value="Photo">Photo</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Inspection Sheet">Inspection Sheet</option>
                </select>
                <span class="chevron">⌄</span>
              </div>
            </div>

            <div class="field-item flex-1">
              <label>Evidence Date *</label>
              <input type="text" v-model="form.date" class="form-input" />
            </div>
          </div>

          <div class="field-item">
            <label>Description *</label>
            <textarea
                v-model="form.description"
                placeholder="Describe what the evidence shows..."
                rows="3"
                class="form-textarea"
            ></textarea>
          </div>

          <div class="field-item">
            <label>Corrective Action Taken</label>
            <input
                type="text"
                v-model="form.correctiveAction"
                placeholder="Describe the corrective action taken or planned."
                class="form-input"
            />
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="card upload-card">
          <h2 class="card-title">Upload Evidence</h2>

          <div class="dropzone" @click="triggerUpload">
            <input
                type="file"
                ref="fileInputRef"
                @change="handleFileUpload"
                class="hidden-input"
                accept=".jpg,.png,.pdf"
            />
            <div class="upload-icon">↑</div>
            <p class="dropzone-text">Drag and drop files here</p>
            <span class="dropzone-sub">or click to upload</span>
          </div>
          <p class="format-note">Accepted formats: JPG, PNG, PDF - Max size: 10 MB each</p>

          <h3 class="uploaded-title">
            Uploaded Evidence ({{ evidenceList.length }})
          </h3>

          <div class="evidence-list">
            <div
                v-for="(item, index) in evidenceList"
                :key="item.id || index"
                class="evidence-item"
            >
              <div class="thumb">PHOTO</div>
              <div class="item-info">
                <strong class="item-name">{{ item.fileName }}</strong>
                <span class="item-date">{{ item.fileSize }} &middot; {{ item.date }}</span>
                <span class="item-desc">{{ item.description }}</span>
              </div>
              <button type="button" class="btn-remove" @click="removeEvidence(index)">&times;</button>
            </div>
            <p v-if="evidenceList.length === 0" class="empty-note">
              No evidence attached to this defect yet.
            </p>
          </div>
        </div>

        <div class="footer-actions">
          <button type="button" class="btn-cancel" @click="$emit('back')">Cancel</button>
          <button type="button" class="btn-save" @click="saveEvidence">Save Evidence</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  defect: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'save-evidence'])

const fileInputRef = ref(null)

const form = reactive({
  type: 'Photo',
  date: 'Sep 16, 2026',
  description: '',
  correctiveAction: ''
})

const evidenceList = ref([...(props.defect.evidences || [])])

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds the 10 MB limit.')
    return
  }

  const newEvd = {
    id: `EVD-00${evidenceList.value.length + 1}`,
    fileName: file.name,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    date: form.date,
    description: form.description || 'Inspection capture of observed defect',
    type: form.type,
    correctiveAction: form.correctiveAction
  }

  evidenceList.value.push(newEvd)
  event.target.value = ''
}

const removeEvidence = (index) => {
  evidenceList.value.splice(index, 1)
}

const saveEvidence = () => {
  emit('save-evidence', {
    defectId: props.defect.id,
    evidences: evidenceList.value
  })
}
</script>

<style scoped>
.add-evidence-page {
  padding: 24px 36px;
  background-color: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}
.back-link {
  background: transparent;
  border: none;
  font-size: 0.85rem;
  color: #1a1a1a;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  font-weight: 500;
}
.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}
.page-subtitle {
  font-size: 0.85rem;
  color: #8892a0;
  margin: 0 0 24px 0;
}
.evidence-grid {
  display: grid;
  grid-template-columns: 460px 1fr;
  gap: 24px;
  align-items: start;
}
.card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}
.card-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}
.highlight-box {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.label {
  display: block;
  font-size: 0.725rem;
  color: #8892a0;
}
.value-id {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}
.badge-pending {
  background-color: #edf2d8;
  color: #485320;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}
.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 14px;
  column-gap: 16px;
}
.full-row { grid-column: span 2; }
.value {
  font-size: 0.85rem;
  color: #1a1a1a;
}
.fields-row {
  display: flex;
  gap: 12px;
}
.flex-1 { flex: 1; }
.field-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
label {
  font-size: 0.825rem;
  font-weight: 500;
  color: #1a1a1a;
}
.select-box {
  position: relative;
}
select, .form-input, .form-textarea {
  width: 100%;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #1a1a1a;
  outline: none;
  background-color: #ffffff;
  box-sizing: border-box;
}
select, .form-input {
  height: 40px;
  padding: 0 12px;
}
select {
  appearance: none;
}
.chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #8892a0;
  pointer-events: none;
}
.form-textarea {
  padding: 10px 12px;
  resize: vertical;
}
.dropzone {
  border: 1.5px dashed #cbd5e1;
  border-radius: 10px;
  padding: 36px 20px;
  text-align: center;
  cursor: pointer;
  background-color: #ffffff;
  transition: background-color 0.15s;
}
.dropzone:hover {
  background-color: #fbfdf9;
}
.hidden-input { display: none; }
.upload-icon {
  font-size: 1.7rem;
  color: #64748b;
  margin-bottom: 6px;
}
.dropzone-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}
.dropzone-sub {
  font-size: 0.775rem;
  color: #8892a0;
}
.format-note {
  font-size: 0.725rem;
  color: #8892a0;
  text-align: center;
  margin: 8px 0 20px 0;
}
.uploaded-title {
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 12px 0;
}
.evidence-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.evidence-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  gap: 12px;
  background-color: #ffffff;
}
.thumb {
  width: 52px;
  height: 48px;
  background-color: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  color: #94a3b8;
}
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.item-name {
  font-size: 0.85rem;
  color: #1a1a1a;
}
.item-date {
  font-size: 0.725rem;
  color: #8892a0;
}
.item-desc {
  font-size: 0.775rem;
  color: #475569;
}
.btn-remove {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #8892a0;
  cursor: pointer;
}
.btn-remove:hover { color: #eb5757; }
.empty-note {
  font-size: 0.8rem;
  color: #8892a0;
  text-align: center;
  margin: 16px 0;
}
.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-cancel {
  padding: 10px 24px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
}
.btn-save {
  padding: 10px 24px;
  border-radius: 8px;
  background: #485320;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}
.font-mono { font-family: 'JetBrains Mono', monospace; }
.font-bold { font-weight: 600; }
.text-right { text-align: right; }
</style>