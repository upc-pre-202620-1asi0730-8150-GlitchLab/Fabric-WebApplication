<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  alert: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const translateStatus = (status) => {
  const key = status?.toLowerCase()
  return ['critical', 'warning', 'optimal'].includes(key) ? t(`alerts.${key}`) : status
}

const translateTitle = (alert) => {
  if (alert.title === 'Machine downtime above limit') {
    return t('alerts.machineDowntimeTitle')
  }
  return alert.title
}

const translateDescription = (alert) => {
  if (alert.type === 'Machine Downtime' && alert.accumulated && alert.limit) {
    return t('alerts.downtimeDescription', {
      accumulated: alert.accumulated,
      limit: alert.limit
    })
  }
  return alert.description
}

const translateAction = (action) => action === 'View Machine' ? t('alerts.viewMachine') : action
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
      {{ translateStatus(alert.status) }}
    </div>

    <div class="alert-information">
      <strong>
        {{ alert.reference }} — {{ translateTitle(alert) }}
      </strong>
      <span>
        {{ translateDescription(alert) }}
      </span>
    </div>

    <button
        class="alert-action"
        @click.stop="$emit('select', alert)"
    >
      {{ translateAction(alert.action) }} →
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