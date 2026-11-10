<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  type: {type: String, required: true},
  labels: {type: Array, default: () => []},
  datasets: {type: Array, default: () => []},
  options: {type: Object, default: () => ({})}
});

const canvas = ref(null);
let chart = null;

const build = () => {
  chart?.destroy();
  chart = new Chart(canvas.value, {
    type: props.type,
    data: {labels: props.labels, datasets: props.datasets},
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {legend: {position: 'bottom'}},
      ...props.options
    }
  });
};

onMounted(build);
watch(() => [props.type, props.labels, props.datasets, props.options], build, {deep: true});
onBeforeUnmount(() => chart?.destroy());
</script>

<template>
  <div class="inspector-chart-canvas">
    <canvas ref="canvas"></canvas>
  </div>
</template>
