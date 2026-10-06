const machineList = () => import('./views/machine-list.vue');
const machineForm = () => import('./views/machine-form.vue');
const machineBreakdown = () => import('./views/machine-breakdown.vue');
const machineDetail = () => import('./views/machine-detail.vue');

const machineRegistrationRoutes = [
    {path: '', name: 'machine-registration-machines', component: machineList, meta: {title: 'Machinery'}},
    {path: 'new', name: 'machine-registration-machine-new', component: machineForm, meta: {title: 'Register Machine'}},
    {path: ':id', name: 'machine-registration-machine-detail', component: machineDetail, meta: {title: 'Machine Detail'}},
    {path: ':id/breakdown', name: 'machine-registration-machine-breakdown', component: machineBreakdown, meta: {title: 'Report Breakdown'}}
];

export default machineRegistrationRoutes;