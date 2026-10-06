<template>
  <div class="disposition-section" v-if="defect">
    <div class="section-header">
      <h3 class="card-title">Disposition for {{ defect.id }}</h3>
      <p class="card-subtitle">Choose what should happen to the observed garments.</p>
    </div>

    <div class="decision-cards">
      <div
          class="decision-card"
          :class="{ active: selectedOption === 'Send to Rework' }"
          @click="selectedOption = 'Send to Rework'"
      >
        <h4 class="decision-title">Send to Rework</h4>
        <p class="decision-desc">Repairable garment.</p>
        <p class="decision-foot">Keeps projected inventory.</p>
      </div>

      <div
          class="decision-card"
          :class="{ active: selectedOption === 'Permanent Discard' }"
          @click="selectedOption = 'Permanent Discard'"
      >
        <h4 class="decision-title">Permanent Discard</h4>
        <p class="decision-desc">Irreparable garment.</p>
        <p class="decision-foot">Reduces saleable batch balance.</p>
      </div>
    </div>

    <div class="disposition-form">
      <div class="form-group flex-2">
        <label class="form-label">Correction</label>
        <div class="select-wrapper">
          <select v-model="correction" class="form-control" :disabled="selectedOption === 'Permanent Discard'">
            <option value="ST-03 — Sewing Correction">ST-03 — Sewing Correction</option>
            <option value="ST-04 — Ironing / Pressing">ST-04 — Ironing / Pressing</option>
            <option value="ST-05 — Stain Cleaning">ST-05 — Stain Cleaning</option>
          </select>
        </div>
      </div>

      <div class="form-group flex-1">
        <label class="form-label">Quantity</label>
        <input
            type="number"
            v-model.number="quantity"
            :max="defect.quantity"
            min="1"
            class="form-control text-center font-mono"
        />
      </div>

      <div class="form-group align-end">
        <button
            type="button"
            class="btn"
            :class="selectedOption === 'Send to Rework' ? 'btn-primary' : 'btn-danger'"
            @click="handleConfirm"
        >
          {{ selectedOption === 'Send to Rework' ? 'Confirm Rework' : 'Confirm Discard' }}
        </button>
      </div>
    </div>

    <div class="info-callout">
      Rework &rarr; pending adjustment queue, no inventory deduction. Discard &rarr; saleable balance reduced and waste cost accumulated.
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  defect: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['apply-disposition']);

const selectedOption = ref('Send to Rework');
const correction = ref('ST-03 — Sewing Correction');
const quantity = ref(6);

watch(
    () => props.defect,
    (newDefect) => {
      if (newDefect) {
        quantity.value = newDefect.quantity;
      }
    },
    { immediate: true }
);

const handleConfirm = () => {
  emit('apply-disposition', {
    defectId: props.defect.id,
    disposition: selectedOption.value,
    correction: selectedOption.value === 'Send to Rework' ? correction.value : 'Scrap',
    quantity: quantity.value
  });
};
</script>

<style scoped>
.disposition-section {
  margin-top: 20px;
}
.card-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}
.card-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.825rem;
  color: #8892a0;
  margin: 0 0 16px 0;
}
.decision-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
.decision-card {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  background-color: #ffffff;
  transition: all 0.2s;
}
.decision-card.active {
  border: 2px solid #485320;
  background-color: #fafcf6;
}
.decision-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #1a1a1a;
}
.decision-desc {
  font-size: 0.8rem;
  color: #8892a0;
  margin: 0 0 4px 0;
}
.decision-foot {
  font-size: 0.775rem;
  color: #8892a0;
  margin: 0;
}
.disposition-form {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 18px;
}
.flex-2 { flex: 2; }
.flex-1 { flex: 1; }
.align-end {
  display: flex;
  align-items: flex-end;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #1a1a1a;
}
.form-control {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #1a1a1a;
  background-color: #ffffff;
  box-sizing: border-box;
}
.form-control:focus {
  border-color: #485320;
  outline: none;
}
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  white-space: nowrap;
}
.btn-primary {
  background-color: #485320;
  color: #ffffff;
}
.btn-danger {
  background-color: #eb5757;
  color: #ffffff;
}
.info-callout {
  background-color: #f8fafc;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 0.775rem;
  color: #64748b;
  line-height: 1.4;
}
.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
.text-center { text-align: center; }
</style>