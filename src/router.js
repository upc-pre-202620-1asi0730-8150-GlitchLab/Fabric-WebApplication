import {createWebHistory, createRouter} from "vue-router";

const pageNotFound = () => import ('./shared/presentation/views/page-not-found.vue');
const productionBatches = () => import ('./production-batches/presentation/views/production-batches.vue');
const dashboard = () => import ('./report-analytics/presentation/views/dashboard.vue');
const qualityView = () => import ('./quality/presentation/views/quality.vue');
const machine = () => import('./machine-registry/presentation/views/machinery.vue');
const alerts = () => import('./alerts/presentation/views/alerts.vue');

const routes = [
    {path: '/dashboard', name:'dashboard', component: dashboard, meta: {title:'Dashboard'}},
    {path : '/production-batches', name:'production-batches', component: productionBatches, meta: {title:'Production Batches'}},
    {path: '/quality', name: 'quality', component: qualityView, meta: {title:'Quality Control'}},
    {path: '/machine-registry', name: 'machinery', component: machine, meta :{title:'Machine Registry'}},
    {path: '/alerts', name:'alerts', component: alerts, meta: {title:'Alerts'}},
    {path: '/', redirect:'/dashboard'},
    {path : '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound , meta: {title: 'Page not found', hideSidebar: true}},
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,

});

let isInitialNavigation = true;

router.beforeEach((to, from) => {

    if (isInitialNavigation) {
        isInitialNavigation = false;
        if (to.name !== 'dashboard' && to.name !== 'not-found') {
            return {name: 'dashboard'};
        }
    }
    console.log(`Navigating from ${from.name} to ${to.name}`);
    const baseTitle = 'Fabric';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    return true;
});

export default router;
