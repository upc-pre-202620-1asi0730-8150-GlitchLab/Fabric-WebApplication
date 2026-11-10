<template>
  <div class="defect-card">
    <div class="card-header">
      <h3 class="card-title">{{ $t('quality.form.title') }}</h3>
      <p class="card-subtitle">{{ $t('quality.form.subtitle') }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-body">
      <div class="form-group">
        <label class="form-label">{{ $t('quality.form.active') }}</label>
        <div class="select-wrapper">
          <select v-model="form.batchId" class="form-control" required>
            <option value="LOT-024 — T-Shirt Basic">LOT-024 — T-Shirt Basic</option>
            <option value="LOT-025 — Polo Shirt">LOT-025 — Polo Shirt</option>
            <option value="LOT-026 — Denim Pants">LOT-026 — Denim Pants</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group flex-2">
          <label class="form-label">{{ $t('quality.form.defect') }}</label>
          <div class="select-wrapper">
            <select v-model="form.defectType" class="form-control" required>
              <option value="Open stitches">{{ $t('quality.form.defectTypes.openStitches') }}</option>
              <option value="Torn fabric">{{ $t('quality.form.defectTypes.tornFabric') }}</option>
              <option value="Uneven seam">{{ $t('quality.form.defectTypes.unevenSeam') }}</option>
              <option value="Oil stain">{{ $t('quality.form.defectTypes.oilStain') }}</option>
              <option value="Loose button">{{ $t('quality.form.defectTypes.looseButton') }}</option>
            </select>
          </div>
        </div>

        <div class="form-group flex-1">
          <label class="form-label">{{ $t('quality.form.qty') }}</label>
          <input
              type="number"
              min="1"
              v-model.number="form.quantity"
              class="form-control text-center font-mono"
              required
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">{{ $t('quality.form.associated') }}</label>
        <div class="select-wrapper">
          <select v-model="form.machineId" class="form-control">
            <option value="MC-014 — Overlock">MC-014 — Overlock</option>
            <option value="MC-015 — Straight Stitch">MC-015 — Straight Stitch</option>
            <option value="MC-016 — Coverstitch">MC-016 — Coverstitch</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">{{ $t('quality.form.origin') }}</label>
        <div class="select-wrapper">
          <select v-model="form.origin" class="form-control">
            <option value="Machine">{{ $t('quality.form.origins.machine') }}</option>
            <option value="Fabric">{{ $t('quality.form.origins.fabric') }}</option>
            <option value="Operator">{{ $t('quality.form.origins.operator') }}</option>
            <option value="Unknown Origin">{{ $t('quality.form.origins.unknown') }}</option>
          </select>
        </div>
        <p class="field-hint">{{ $t('quality.form.originHint') }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">{{ $t('quality.form.observation') }}</label>
        <textarea
            v-model="form.observation"
            class="form-control textarea"
            rows="2"
            :placeholder="$t('quality.form.observationPlaceholder')"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          {{ $t('quality.form.btnRegister') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['register-defect']);

const form = reactive({
  batchId: 'LOT-024 — T-Shirt Basic',
  defectType: 'Open stitches',
  quantity: 6,
  machineId: 'MC-014 — Overlock',
  origin: 'Machine',
  observation: ''
});

const handleSubmit = () => {
  const finalStatus = form.origin === 'Unknown Origin' ? 'In Evaluation' : 'Pending Decision';

  emit('register-defect', {
    ...form,
    status: finalStatus
  });

  form.observation = '';
};
</script>

<style scoped>
.defect-card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.card-header {
  margin-bottom: 20px;
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
  margin: 0;
}
.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-row {
  display: flex;
  gap: 12px;
}
.flex-2 { flex: 2; }
.flex-1 { flex: 1; }
.form-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #1a1a1a;
}
.select-wrapper {
  position: relative;
  width: 100%;
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
  outline: none;
  transition: border-color 0.2s;
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

textarea.form-control {
  min-height: 60px;
  padding: 10px 14px;
  line-height: 1.4;
  resize: vertical;
}

.form-control:focus {
  border-color: #485320;
}
.field-hint {
  font-family: 'Inter', sans-serif;
  font-size: 0.725rem;
  color: #8892a0;
  margin: 4px 0 0 0;
}
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
.btn-primary {
  background-color: #485320;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover {
  opacity: 0.92;
}
.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
.text-center {
  text-align: center;
}
</style>