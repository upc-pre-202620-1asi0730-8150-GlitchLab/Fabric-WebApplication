<!--
  @summary Presentation component displaying the 4 operational stages in a horizontal stepper.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-4 border-round shadow-1 mb-4">
    <h3 class="m-0 text-xl font-bold text-900 mb-1">Production Stages</h3>
    <p class="m-0 text-sm text-600 mb-4">Current operational progress of the batch.</p>

    <div class="flex align-items-center justify-content-between relative px-4 py-2">
      <div
          v-for="(stage, index) in stages"
          :key="stage.name"
          class="flex flex-column align-items-center z-1"
      >
        <div
            class="border-circle w-2rem h-2rem flex align-items-center justify-content-center font-bold text-sm mb-2 transition-colors"
            :class="getStepClass(stage, index)"
        >
          <i v-if="isCompleted(index)" class="pi pi-check text-white text-xs"></i>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span
            class="text-sm font-semibold"
            :class="stage.name === currentStage ? 'text-primary font-bold' : 'text-600'"
        >
          {{ stage.name }}
        </span>
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
      default: 'Sewing'
    }
  },
  data() {
    return {
      stages: [
        { name: 'Cutting' },
        { name: 'Sewing' },
        { name: 'Finishing' },
        { name: 'Completed' }
      ]
    };
  },
  methods: {
    getCurrentIndex() {
      return this.stages.findIndex(s => s.name === this.currentStage);
    },
    isCompleted(index) {
      return index < this.getCurrentIndex();
    },
    getStepClass(stage, index) {
      const currentIndex = this.getCurrentIndex();
      if (index < currentIndex) {
        return 'bg-green-600 text-white';
      } else if (index === currentIndex) {
        return 'custom-active-step text-white';
      } else {
        return 'bg-gray-200 text-600';
      }
    }
  }
};
</script>

<style scoped>
.custom-active-step {
  background-color: #536228 !important;
}
</style>