<script setup>
import AppSidebar from "./app-sidebar.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
defineProps({
  navItems: {type: Array, default: () => []}
});
const emit = defineEmits(['logout']);
const hideSidebar = computed(() => route.meta.hideSidebar === true);
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="layout">
    <app-sidebar v-if="!hideSidebar" :nav-items="navItems" @logout="emit('logout')"/>
    <main class="layout-content" :class="{ 'layout-content-full': hideSidebar }">
      <router-view/>
    </main>
  </div>
</template>
