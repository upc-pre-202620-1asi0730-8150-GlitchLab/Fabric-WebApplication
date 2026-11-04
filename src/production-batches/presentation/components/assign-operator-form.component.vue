<template>
  <div class="card">
    <h3 class="card-title">Assign Operators</h3>
    <p class="card-subtitle">Assign one or more operators to the current production stage.</p>

    <div class="assign-row">
      <div class="form-group flex-1">
        <label for="stage">Production Stage *</label>
        <input id="stage" type="text" :value="currentStage" disabled class="custom-input disabled" />
      </div>
      <div class="form-group flex-2">
        <label for="operators">Operators *</label>
        <select id="operators" v-model="selectedOperatorId" class="custom-select">
          <option value="" disabled>Select operators</option>
          <option v-for="operator in operators" :key="operator.id" :value="operator.id">
            {{ operator.name }} ({{ operator.specialty }})
          </option>
        </select>
      </div>
      <button type="button" class="btn-olive self-end" @click="$emit('assign-operator')">Assign Operators</button>
    </div>

    <div v-if="errorMessage" class="warning-banner">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'assign-operator-form',
  props: {
    currentStage: {
      type: String,
      required: true
    },
    operators: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  emits: ['assign-operator', 'update:modelValue']
};
</script>

<style scoped>
.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; color: #111827; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 20px 0; }
.assign-row { display: flex; gap: 16px; align-items: flex-end; margin-bottom: 16px; }
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.self-end { align-self: flex-end; }
.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #374151; }
.custom-input, .custom-select { width: 100%; height: 44px; border: 1px solid #E5E7EB; border-radius: 8px; padding: 0 14px; box-sizing: border-box; font-size: 14px; color: #374151; outline: none; background-color: #ffffff; }
.custom-input.disabled { background-color: #F9FAFB; }
.warning-banner { background: #FDF2F2; color: #B93838; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-top: 12px; }
.btn-olive { background: #48532B; color: #ffffff; border: none; padding: 0 24px; border-radius: 8px; font-weight: 600; cursor: pointer; height: 44px; font-size: 14px; }
</style>
