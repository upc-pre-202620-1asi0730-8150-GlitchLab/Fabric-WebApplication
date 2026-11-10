const roleSelection = () => import('./views/role-selection.vue');

const identityAccessRoutes = [
    {
        path: '/login',
        name: 'role-selection',
        component: roleSelection,
        meta: {title: 'Role Selection', hideSidebar: true, guestOnly: true}
    }
];

export default identityAccessRoutes;
