<template>
  <div>
    <div class="card">
      <h3 class="card-title">{{ $t('productionBatches.observations.addTitle') }}</h3>
      <p class="card-subtitle">{{ $t('productionBatches.observations.addDescription') }}</p>

      <div class="form-group mb-16">
        <label>{{ $t('productionBatches.observations.observation') }}</label>
        <textarea v-model="localText" rows="3" :placeholder="$t('productionBatches.observations.placeholder')" class="custom-textarea"></textarea>
      </div>

      <div class="card-footer">
        <span class="help-text">{{ $t('productionBatches.observations.emptyHint') }}</span>
        <button class="btn-olive" :disabled="!localText.trim()" @click="handleSave">{{ $t('productionBatches.observations.save') }}</button>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">{{ $t('productionBatches.observations.historyTitle') }}</h3>
      <p class="card-subtitle">{{ $t('productionBatches.observations.historyDescription') }}</p>

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

<script>
export default {
  name: 'batch-observations-timeline',
  props: {
    observations: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['save-observation'],
  data() {
    return {
      localText: ''
    };
  },
  methods: {
    handleSave() {
      if (this.localText.trim()) {
        this.$emit('save-observation', this.localText.trim());
        this.localText = '';
      }
    }
  }
};
</script>

<style scoped>
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