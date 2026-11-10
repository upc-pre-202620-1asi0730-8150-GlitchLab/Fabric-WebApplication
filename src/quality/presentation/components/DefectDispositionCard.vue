<template>
  <div class="disposition-section" v-if="defect">
    <div class="section-header">
      <h3 class="card-title">{{ $t('quality.disposition.title') }} {{ defect.id }}</h3>
      <p class="card-subtitle">{{ $t('quality.disposition.subtitle') }}</p>
    </div>

    <div class="decision-cards">
      <div
          class="decision-card"
          :class="{ active: selectedOption === 'Send to Rework' }"
          @click="selectedOption = 'Send to Rework'"
      >
        <h4 class="decision-title">{{ $t('quality.disposition.rework.title') }}</h4>
        <p class="decision-desc">{{ $t('quality.disposition.rework.desc') }}</p>
        <p class="decision-foot">{{ $t('quality.disposition.rework.foot') }}</p>
      </div>

      <div
          class="decision-card"
          :class="{ active: selectedOption === 'Permanent Discard' }"
          @click="selectedOption = 'Permanent Discard'"
      >
        <h4 class="decision-title">{{ $t('quality.disposition.discard.title') }}</h4>
        <p class="decision-desc">{{ $t('quality.disposition.discard.desc') }}</p>
        <p class="decision-foot">{{ $t('quality.disposition.discard.foot') }}</p>
      </div>
    </div>

    <div class="disposition-form">
      <div class="form-group flex-2">
        <label class="form-label">{{ $t('quality.disposition.correction') }}</label>
        <div class="select-wrapper">
          <select v-model="correction" class="form-control" :disabled="selectedOption === 'Permanent Discard'">
            <option value="ST-03 — Sewing Correction">ST-03 — Sewing Correction</option>
            <option value="ST-04 — Ironing / Pressing">ST-04 — Ironing / Pressing</option>
            <option value="ST-05 — Stain Cleaning">ST-05 — Stain Cleaning</option>
          </select>
        </div>
      </div>

      <div class="form-group flex-1">
        <label class="form-label">{{ $t('quality.disposition.quantity') }}</label>
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
          {{ selectedOption === 'Send to Rework' ? $t('quality.disposition.btnRework') : $t('quality.disposition.btnDiscard') }}
        </button>
      </div>
    </div>

    <div class="info-callout">
      {{ $t('quality.disposition.callout') }}
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
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #1a1a1a;
  background-color: #ffffff;
  box-sizing: border-box;
}

select.form-control {
  height: 42px;
  line-height: normal;
  padding: 0 32px 0 14px;
  cursor: pointer;
}

input.form-control {
  height: 42px;
  line-height: normal;
  padding: 0 14px;
}

.form-control:focus {
  border-color: #485320;
  outline: none;
}
.btn {
  padding: 10px 20px;
  height: 42px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  box-sizing: border-box;
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