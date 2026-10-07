import machineMaintenanceForm from "./views/machine-maintenance-form.vue";

const machineList = () => import('./views/machine-list.vue');
const machineForm = () => import('./components/machine-form.vue');
const machineBreakdown = () => import('./views/machine-breakdown.vue');
const machineDetail = () => import('./views/machine-detail.vue');

const machineRegistrationRoutes = [
    {path: '', name: 'machine-registration-machines', component: machineList, meta: {title: 'Machinery'}},
    {path: 'new', name: 'machine-registration-machine-new', component: machineForm, meta: {title: 'Register Machine'}},
    {path: ':id', name: 'machine-registration-machine-detail', component: machineDetail, meta: {title: 'Machine Detail'}},
    {path: ':id/maintenance/new', name: 'machine-registration-machine-maintenance-new', component: machineMaintenanceForm, meta: {title: 'Register Maintenance'}},
    {path: ':id/breakdown', name: 'machine-registration-machine-breakdown', component: machineBreakdown, meta: {title: 'Report Breakdown'}}
];

export default machineRegistrationRoutes;