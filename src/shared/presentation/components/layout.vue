<script setup>
import AppSidebar from "./app-sidebar.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const hideSidebar = computed(() => route.meta.hideSidebar === true);
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="layout">
    <app-sidebar v-if="!hideSidebar"/>
    <main class="layout__content" :class="{ 'layout__content--full': hideSidebar }">
      <router-view/>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
}

.layout__content {
  flex: 1;
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
  background: #fafaf7;
}

.layout__content--full {
  padding: 0;
  width: 100%;
}
</style>