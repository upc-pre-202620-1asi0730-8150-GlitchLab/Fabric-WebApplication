import { createWebHistory, createRouter } from "vue-router";
import machineRegistrationRoutes from "./machine-registration/presentation/machine-routes.js";
import identityAccessRoutes from "./identity-access/presentation/identity-routes.js";
import {authGuard, withRole} from "./identity-access/presentation/auth-guard.js";
import {USER_ROLES} from "./identity-access/domain/model/user-role.js";
import qualityInspectorRoutes from "./quality/presentation/quality-inspector-routes.js";

const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const dashboard = () => import('./report-analytics/presentation/views/report-analytics.vue');
const alerts = () => import('./alerts/presentation/views/alerts.vue');

const qualityView = () => import('./quality/presentation/views/quality.vue');
const newFabricInspectionView = () => import('./quality/presentation/views/NewFabricInspectionView.vue');
const inspectionSheetView = () => import('./quality/presentation/views/InspectionSheetView.vue');

const productionBatchesList = () => import('./production-batches/presentation/views/production-batches-list.view.vue');
const createProductionBatch = () => import('./production-batches/presentation/views/create-production-batch.view.vue');
const batchDetail = () => import('./production-batches/presentation/views/batch-detail.view.vue');

const routes = [
    ...identityAccessRoutes,
    ...withRole(USER_ROLES.QUALITY_INSPECTOR, qualityInspectorRoutes),

    {
        path: '/dashboard',
        name: 'dashboard',
        component: dashboard,
        meta: { title: 'Dashboard' }
    },

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
        redirect: to => ({ path: `/production-batches/${to.params.id}`, query: { tab: 'operators' } })
    },
    {
        path: '/production-batches/:id/traceability',
        alias: ['/production-batches/:id/history'],
        name: 'traceability-history',
        redirect: to => ({ path: `/production-batches/${to.params.id}`, query: { tab: 'traceability' } })
    },
    {
        path: '/production-batches/:id/observations',
        name: 'batch-observations',
        redirect: to => ({ path: `/production-batches/${to.params.id}`, query: { tab: 'observations' } })
    },

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
        path: '/quality/inspections/:id',
        name: 'inspection-sheet',
        component: inspectionSheetView,
        meta: { title: 'Roll Inspection' }
    },
    {
        path: '/quality/inspections/:id/shrinkage-test',
        name: 'shrinkage-test',
        redirect: to => ({ path: `/quality/inspections/${to.params.id}`, query: { step: 'shrinkage' } })
    },
    {
        path: '/quality/inspections/:id/parameters',
        name: 'inspection-parameters',
        redirect: to => ({ path: `/quality/inspections/${to.params.id}`, query: { step: 'parameters' } })
    },

    {
        path: '/machinery',
        name: 'machinery',
        children: machineRegistrationRoutes
    },

    {
        path: '/alerts',
        name: 'alerts',
        component: alerts,
        meta: { title: 'Alerts' }
    },

    {
        path: '/',
        redirect: '/login'
    },

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