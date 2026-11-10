<script setup>
defineProps({
  title: String,
  value: [String, Number],
  description: String
})
</script>

<template>
  <div class="report-stat-card">
    <span class="report-stat-title">{{ title }}</span>
    <strong class="report-stat-value">{{ value }}</strong>
    <span class="report-stat-description">{{ description }}</span>
  </div>
</template>
