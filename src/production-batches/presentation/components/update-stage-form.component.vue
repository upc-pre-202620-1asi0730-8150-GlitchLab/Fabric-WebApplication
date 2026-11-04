<template>
  <div class="card">
    <h3 class="card-title">Update Production Stage</h3>
    <p class="card-subtitle">Register the quantity processed and move the batch to its next stage.</p>

    <div>
      <div class="form-grid">
        <div class="form-group">
          <label for="newStage">New Stage *</label>
          <select id="newStage" v-model="form.newStage" class="custom-select">
            <option v-for="stage in stages" :key="stage" :value="stage">{{ stage }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="processedQuantity">Processed Quantity *</label>
          <div class="input-with-suffix">
            <input id="processedQuantity" type="number" v-model.number="form.processedQuantity" placeholder="e.g. 640" class="custom-input" />
            <span class="suffix">garments</span>
          </div>
        </div>
        <div class="form-group full-width">
          <label for="stageNotes">Notes</label>
          <input id="stageNotes" type="text" v-model="form.notes" placeholder="Optional production notes" class="custom-input" />
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        <button type="button" class="btn-olive" @click="handleUpdate">Update Stage</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'update-stage-form',
  props: {
    currentStage: {
      type: String,
      default: ''
    },
    stages: {
      type: Array,
      default: () => ['Cutting', 'Sewing', 'Finishing', 'Quality Check', 'Completed']
    }
  },
  emits: ['update-stage', 'cancel'],
  data() {
    return {
      form: {
        newStage: this.currentStage,
        processedQuantity: null,
        notes: ''
      }
    };
  },
  watch: {
    currentStage(stage) {
      this.form.newStage = stage;
    }
  },
  methods: {
    handleUpdate() {
      this.$emit('update-stage', { ...this.form });
    }
  }
};
</script>

<style scoped>
.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 24px 0; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.full-width { grid-column: span 2; }
.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.custom-input, .custom-select { width: 100%; height: 40px; border: 1px solid #E5E7EB; border-radius: 8px; padding: 0 12px; box-sizing: border-box; }
.input-with-suffix { position: relative; display: flex; align-items: center; }
.suffix { position: absolute; right: 12px; color: #9CA3AF; font-size: 12px; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-olive { background: #48532B; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-cancel { background: #fff; border: 1px solid #E5E7EB; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>
