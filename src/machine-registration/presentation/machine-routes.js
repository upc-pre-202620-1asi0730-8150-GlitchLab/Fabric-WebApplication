const machineList = () => import('./views/machine-list.vue');
const machineForm = () => import('./views/machine-form.vue');

const machineRegistrationRoutes = [
    {path: '', name: 'machine-registration-machines', component: machineList, meta: {title: 'Machinery'}},
    {path: 'new', name: 'machine-registration-machine-new', component: machineForm, meta: {title: 'Register Machine'}}
];

export default machineRegistrationRoutes;