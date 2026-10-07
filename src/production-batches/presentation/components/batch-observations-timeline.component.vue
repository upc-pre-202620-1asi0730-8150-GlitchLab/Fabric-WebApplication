<!--
  @summary Presentation component for registering operational observations and displaying timeline.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div>
    <!-- Add Observation Form Card -->
    <div class="surface-card p-4 border-round shadow-1 mb-4">
      <h3 class="m-0 text-xl font-bold text-900 mb-1">Add Observation</h3>
      <p class="m-0 text-sm text-600 mb-3">Document incidents or agreements that are not formal defects.</p>

      <form @submit.prevent="handleSave">
        <label for="observationText" class="font-semibold block mb-2 text-700">Observation *</label>
        <textarea
            id="observationText"
            v-model="newContent"
            rows="4"
            class="p-inputtext w-full mb-2"
            placeholder="Write an observation about this production batch..."
            required
        ></textarea>

        <div class="flex align-items-center justify-content-between">
          <span class="text-xs text-500">Empty text or spaces only &rarr; observation cannot be saved.</span>
          <pv-button label="Save Observation" type="submit" class="custom-olive-btn px-4" :disabled="!newContent.trim()" />
        </div>
      </form>
    </div>

    <!-- Timeline History Card -->
    <div class="surface-card p-4 border-round shadow-1">
      <h3 class="m-0 text-xl font-bold text-900 mb-1">Observation History</h3>
      <p class="m-0 text-sm text-600 mb-4">Most recent observations appear first.</p>

      <div class="flex flex-column gap-4">
        <div
            v-for="obs in observations"
            :key="obs.id"
            class="border-left-2 border-primary pl-3 py-1"
        >
          <div class="text-xs font-bold text-700 mb-1">{{ obs.createdAt }}</div>
          <p class="m-0 text-sm text-800 font-medium mb-1">{{ obs.content }}</p>
          <span class="text-xs text-500">Registered by {{ obs.authorName }}</span>
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
      default: () => [
        { id: 1, createdAt: '16/09/2026 · 11:42', content: 'Production paused for 15 minutes while material availability was confirmed.', authorName: 'Rosangela Silva' },
        { id: 2, createdAt: '15/09/2026 · 16:10', content: 'Supervisor agreed to prioritize finishing before end of shift.', authorName: 'Rosangela Silva' }
      ]
    }
  },
  emits: ['save-observation'],
  data() {
    return {
      newContent: ''
    };
  },
  methods: {
    handleSave() {
      if (this.newContent.trim()) {
        this.$emit('save-observation', this.newContent.trim());
        this.newContent = '';
      }
    }
  }
};
</script>

<style scoped>
.custom-olive-btn {
  background-color: #536228 !important;
  border-color: #536228 !important;
}
</style>