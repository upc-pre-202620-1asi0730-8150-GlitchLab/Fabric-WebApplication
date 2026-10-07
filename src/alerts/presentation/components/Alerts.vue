<script setup>
defineProps({
  alert: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
</script>

<template>
  <div
      class="alert-row"
      :class="`alert-${(alert.status || '').toLowerCase()}`"
      @click="$emit('select', alert)"
  >
    <div
        class="alert-status"
        :class="`status-${(alert.status || '').toLowerCase()}`"
    >
      {{ alert.status }}
    </div>

    <div class="alert-information">
      <strong>
        {{ alert.reference }} — {{ alert.title }}
      </strong>
      <span>
        {{ alert.description }}
      </span>
    </div>

    <button
        class="alert-action"
        @click.stop="$emit('select', alert)"
    >
      {{ alert.action }} →
    </button>
  </div>
</template>

<style scoped>
.alert-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 1rem;
}

.alert-row:hover {
  border-color: #64748b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.alert-critical {
  border-left: 4px solid #ef4444;
}

.alert-warning {
  border-left: 4px solid #f59e0b;
}

.alert-optimal {
  border-left: 4px solid #10b981;
}

.alert-status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
}

.status-critical {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-optimal {
  background-color: #d1fae5;
  color: #065f46;
}

.alert-information {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.25rem;
}

.alert-information strong {
  font-size: 0.95rem;
  color: #0f172a;
}

.alert-information span {
  font-size: 0.85rem;
  color: #64748b;
}

.alert-action {
  background: transparent;
  border: none;
  color: #43521f;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
}

.alert-action:hover {
  text-decoration: underline;
}
</style>