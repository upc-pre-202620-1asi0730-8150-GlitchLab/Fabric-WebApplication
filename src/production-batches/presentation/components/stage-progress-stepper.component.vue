<template>
  <div class="card">
    <h3 class="card-title">Production Stages</h3>
    <p class="card-subtitle">Current operational progress of the batch.</p>

    <div class="stepper">
      <div v-for="(stage, idx) in stages" :key="stage" class="step-wrapper">
        <div :class="['step-item', getStageStatus(stage)]">
          <div class="step-circle">{{ getStageStatus(stage) === 'completed' ? '✓' : idx + 1 }}</div>
          <span :class="['step-label', { bold: stage === currentStage }]">{{ stage }}</span>
        </div>
        <div v-if="idx < stages.length - 1" :class="['step-line', { active: idx < currentStageIndex }]"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'stage-progress-stepper',
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
  computed: {
    currentStageIndex() {
      return this.stages.indexOf(this.currentStage);
    }
  },
  methods: {
    getStageStatus(stage) {
      const index = this.stages.indexOf(stage);
      if (index < this.currentStageIndex) return 'completed';
      if (index === this.currentStageIndex) return 'current';
      return 'future';
    }
  }
};
</script>

<style scoped>
.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 24px 0; }
.stepper { display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
.step-wrapper { display: flex; align-items: center; flex: 1; }
.step-wrapper:last-child { flex: 0; }
.step-item { text-align: center; }
.step-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 8px auto; }
.completed .step-circle, .current .step-circle { background-color: #48532B; color: #ffffff; }
.future .step-circle { background-color: #E5E7EB; color: #6B7280; }
.step-line { flex: 1; height: 2px; background-color: #E5E7EB; margin: 0 12px -20px 12px; }
.step-line.active { background-color: #48532B; }
.step-label { font-size: 13px; color: #6B7280; }
.step-label.bold { font-weight: 700; color: #111827; }
</style>
