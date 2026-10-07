import { createWebHistory, createRouter } from "vue-router";

// Lazy loading de vistas
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const dashboard = () => import('./report-analytics/presentation/views/report-analytics.vue');
const qualityView = () => import('./quality/presentation/views/quality.vue');
const machine = () => import('./machine-registry/presentation/views/machinery.vue');
const alerts = () => import('./alerts/presentation/views/alerts.vue');

// Lazy loading del módulo Production Batches
const productionBatchesList = () => import('./production-batches/presentation/views/production-batches-list.view.vue');
const createProductionBatch = () => import('./production-batches/presentation/views/create-production-batch.view.vue');
const batchDetail = () => import('./production-batches/presentation/views/batch-detail.view.vue');
const batchOperatorAssignment = () => import('./production-batches/presentation/views/batch-operator-assignment.view.vue');
const traceabilityHistory = () => import('./production-batches/presentation/views/traceability-history.view.vue');
const batchObservations = () => import('./production-batches/presentation/views/batch-observations.view.vue');

const routes = [
    { path: '/dashboard', name: 'dashboard', component: dashboard, meta: { title: 'Dashboard' } },
    { path: '/production-batches', name: 'production-batches', component: productionBatchesList, meta: { title: 'Production Batches' } },
    { path: '/production-batches/create', name: 'create-production-batch', component: createProductionBatch, meta: { title: 'Create Production Batch' } },
    { path: '/production-batches/:id', name: 'batch-detail', component: batchDetail, meta: { title: 'Batch Detail' } },
    { path: '/production-batches/:id/operators', name: 'batch-operator-assignment', component: batchOperatorAssignment, meta: { title: 'Assign Operators' } },

    /* Configuración flexible para History / Traceability */
    {
        path: '/production-batches/:id/traceability',
        alias: ['/production-batches/:id/history'],
        name: 'traceability-history',
        component: traceabilityHistory,
        meta: { title: 'Traceability History' }
    },
    {
        path: '/production-batches/:id/history',
        name: 'batch-history',
        redirect: to => `/production-batches/${to.params.id}/traceability`
    },

    { path: '/production-batches/:id/observations', name: 'batch-observations', component: batchObservations, meta: { title: 'Batch Observations' } },
    { path: '/quality', name: 'quality', component: qualityView, meta: { title: 'Quality Control' } },
    { path: '/machine-registry', name: 'machinery', component: machine, meta: { title: 'Machine Registry' } },
    { path: '/alerts', name: 'alerts', component: alerts, meta: { title: 'Alerts' } },
    { path: '/', redirect: '/dashboard' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found', hideSidebar: true } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach((to, from, next) => {
    const baseTitle = 'Fabric';
    document.title = `${baseTitle} - ${to.meta?.title || 'App'}`;
    next();
});

export default router;