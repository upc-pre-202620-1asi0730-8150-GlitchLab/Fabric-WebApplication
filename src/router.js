import { createWebHistory, createRouter } from "vue-router";
import machineRegistrationRoutes from "./machine-registration/presentation/machine-routes.js";
import identityAccessRoutes from "./identity-access/presentation/identity-routes.js";
import {authGuard} from "./identity-access/presentation/auth-guard.js";

const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const dashboard = () => import('./report-analytics/presentation/views/report-analytics.vue');
const alerts = () => import('./alerts/presentation/views/alerts.vue');

// Quality
const qualityView = () => import('./quality/presentation/views/quality.vue');
const newFabricInspectionView = () => import('./quality/presentation/views/NewFabricInspectionView.vue');
const shrinkageTestView = () => import('./quality/presentation/views/ShrinkageTestView.vue');
const inspectionParametersView = () => import('./quality/presentation/views/InspectionParametersView.vue');

// Production Batches
const productionBatchesList = () => import('./production-batches/presentation/views/production-batches-list.view.vue');
const createProductionBatch = () => import('./production-batches/presentation/views/create-production-batch.view.vue');
const batchDetail = () => import('./production-batches/presentation/views/batch-detail.view.vue');
const batchOperatorAssignment = () => import('./production-batches/presentation/views/batch-operator-assignment.view.vue');
const traceabilityHistory = () => import('./production-batches/presentation/views/traceability-history.view.vue');
const batchObservations = () => import('./production-batches/presentation/views/batch-observations.view.vue');

const routes = [
    ...identityAccessRoutes,

    // Dashboard
    {
        path: '/dashboard',
        name: 'dashboard',
        component: dashboard,
        meta: { title: 'Dashboard' }
    },

    // Production Batches
    {
        path: '/production-batches',
        name: 'production-batches',
        component: productionBatchesList,
        meta: { title: 'Production Batches' }
    },
    {
        path: '/production-batches/create',
        name: 'create-production-batch',
        component: createProductionBatch,
        meta: { title: 'Create Production Batch' }
    },
    {
        path: '/production-batches/:id',
        name: 'batch-detail',
        component: batchDetail,
        meta: { title: 'Batch Detail' }
    },
    {
        path: '/production-batches/:id/operators',
        name: 'batch-operator-assignment',
        component: batchOperatorAssignment,
        meta: { title: 'Assign Operators' }
    },
    {
        path: '/production-batches/:id/traceability',
        alias: ['/production-batches/:id/history'],
        name: 'traceability-history',
        component: traceabilityHistory,
        meta: {
            title: 'Traceability History'
        }
    },
    {
        path: '/production-batches/:id/history',
        name: 'batch-history',
        redirect: to => `/production-batches/${to.params.id}/traceability`
    },
    {
        path: '/production-batches/:id/observations',
        name: 'batch-observations',
        component: batchObservations,
        meta: { title: 'Batch Observations' }
    },

    // Quality
    {
        path: '/quality',
        name: 'quality',
        component: qualityView,
        meta: { title: 'Quality Control' }
    },
    {
        path: '/quality/inspections/new',
        name: 'new-fabric-inspection',
        component: newFabricInspectionView,
        meta: { title: 'New Fabric Inspection' }
    },
    {
        path: '/quality/inspections/:id/shrinkage-test',
        name: 'shrinkage-test',
        component: shrinkageTestView,
        meta: { title: 'Shrinkage Test' }
    },
    {
        path: '/quality/inspections/:id/parameters',
        name: 'inspection-parameters',
        component: inspectionParametersView,
        meta: { title: 'Inspection Parameters' }
    },

    // Machine Registration
    {
        path: '/machinery',
        name: 'machinery',
        children: machineRegistrationRoutes
    },

    // Alerts
    {
        path: '/alerts',
        name: 'alerts',
        component: alerts,
        meta: { title: 'Alerts' }
    },

    // Default
    {
        path: '/',
        redirect: '/login'
    },

    // 404
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: pageNotFound,
        meta: {
            title: 'Page not found',
            hideSidebar: true,
            public: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach(authGuard);

router.beforeEach((to, from) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);

    const baseTitle = 'Fabric';
    document.title = `${baseTitle} - ${to.meta?.title || 'App'}`;

    return true;
});

export default router;