<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()
const router = useRouter()

const activeSection = computed(() => {
  if (!route.path) return 'dashboard'
  if (route.path.startsWith('/production-batches')) return 'batches'
  if (route.path.startsWith('/quality')) return 'quality'
  if (route.path.startsWith('/machine-registry')) return 'machinery'
  if (route.path.startsWith('/alerts')) return 'alerts'
  return 'dashboard'
})

const handlePageChange = (page) => {
  const routeMap = {
    'dashboard': '/dashboard',
    'batches': '/production-batches',
    'production-batches': '/production-batches',
    'quality': '/quality',
    'machinery': '/machine-registry',
    'alerts': '/alerts'
  }
  const targetRoute = routeMap[page] || '/dashboard'
  router.push(targetRoute)
}
</script>

<template>
  <div class="app flex min-h-screen surface-ground">
    <Sidebar
        :current-page="activeSection"
        @change-page="handlePageChange"
    />

    <main class="main-content flex-grow-1 p-0">
      <router-view />
    </main>
  </div>
</template>

<style>
:root {
  --olive-primary: #4D5628;
  --olive-hover: #3E461F;
  --bg-card: #FFFFFF;
  --bg-app: #F8F9FA;
  --text-main: #111827;
  --text-muted: #6B7280;
  --border-light: #E5E7EB;
}

body {
  margin: 0;
  background-color: var(--bg-app);
  font-family: var(--font-family, system-ui, -apple-system, sans-serif);
  color: var(--text-main);
}

.btn-olive {
  background-color: var(--olive-primary) !important;
  border-color: var(--olive-primary) !important;
  color: #ffffff !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
}

.btn-olive:hover {
  background-color: var(--olive-hover) !important;
  border-color: var(--olive-hover) !important;
}

.btn-outline-cancel {
  background-color: #ffffff !important;
  border: 1px solid #D1D5DB !important;
  color: #374151 !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
}

.status-badge-in-production {
  background-color: #EAEFE3 !important;
  color: #4D5628 !important;
}
.status-badge-at-risk {
  background-color: #F8F6E6 !important;
  color: #85701B !important;
}
.status-badge-completed {
  background-color: #E4EFE3 !important;
  color: #2E6838 !important;
}
.status-badge-delayed {
  background-color: #FCE8E8 !important;
  color: #C53030 !important;
}

</style>