import {USER_ROLES} from "../domain/model/user-role.js";

const roleSelection = () => import('./views/role-selection.vue');
const qualityInspectorHome = () => import('./views/quality-inspector-home.vue');

const identityAccessRoutes = [
    {
        path: '/login',
        name: 'role-selection',
        component: roleSelection,
        meta: {title: 'Role Selection', hideSidebar: true, guestOnly: true}
    },
    {
        path: '/inspector',
        name: 'quality-inspector-home',
        component: qualityInspectorHome,
        meta: {title: 'Quality Inspector', hideSidebar: true, role: USER_ROLES.QUALITY_INSPECTOR}
    }
];

export default identityAccessRoutes;
