const inspectorPlaceholder = () => import('./views/inspector-placeholder.view.vue');
const newRollInspection = () => import('./views/new-roll-inspection.view.vue');
const inspectionParameters = () => import('./views/inspection-parameters.view.vue');

const qualityInspectorRoutes = [
    {
        path: '/inspector/dashboard',
        name: 'quality-inspector-home',
        component: inspectorPlaceholder,
        meta: {title: 'Inspector Dashboard', titleKey: 'qualityInspector.nav.dashboard'}
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
        component: inspectorPlaceholder,
        meta: {title: 'Shrinkage Test', titleKey: 'qualityInspector.nav.shrinkageTest'}
    }
];

export default qualityInspectorRoutes;
