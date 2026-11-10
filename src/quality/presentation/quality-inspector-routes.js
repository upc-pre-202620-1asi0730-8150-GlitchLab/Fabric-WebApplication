const inspectorDashboard = () => import('./views/inspector-dashboard.view.vue');
const newRollInspection = () => import('./views/new-roll-inspection.view.vue');
const inspectionParameters = () => import('./views/inspection-parameters.view.vue');
const shrinkageTest = () => import('./views/shrinkage-test.view.vue');

const qualityInspectorRoutes = [
    {
        path: '/inspector/dashboard',
        name: 'quality-inspector-home',
        component: inspectorDashboard,
        meta: {title: 'Inspector Dashboard'}
    },
    {
        path: '/inspector/inspections/new',
        name: 'inspector-new-inspection',
        component: newRollInspection,
        meta: {title: 'New Roll Inspection'}
    },
    {
        path: '/inspector/parameters',
        name: 'inspector-parameters',
        component: inspectionParameters,
        meta: {title: 'Inspection Parameters'}
    },
    {
        path: '/inspector/shrinkage-test',
        name: 'inspector-shrinkage-test',
        component: shrinkageTest,
        meta: {title: 'Shrinkage Test'}
    }
];

export default qualityInspectorRoutes;
