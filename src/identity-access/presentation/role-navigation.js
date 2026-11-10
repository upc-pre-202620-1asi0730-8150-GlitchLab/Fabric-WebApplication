import {USER_ROLES} from "../domain/model/user-role.js";

const NAV_ITEMS_BY_ROLE = {
    [USER_ROLES.PRODUCTION_SUPERVISOR]: [
        {to: "/dashboard", icon: "pi pi-home", labelKey: "sidebar.dashboard"},
        {to: "/production-batches", icon: "pi pi-box", labelKey: "sidebar.productionBatches"},
        {to: "/quality", icon: "pi pi-verified", labelKey: "sidebar.quality"},
        {to: "/machinery", icon: "pi pi-cog", labelKey: "sidebar.machinery"},
        {to: "/alerts", icon: "pi pi-bell", labelKey: "sidebar.alerts"}
    ],
    [USER_ROLES.QUALITY_INSPECTOR]: [
        {to: "/inspector/dashboard", icon: "pi pi-home", labelKey: "qualityInspector.nav.dashboard"},
        {to: "/inspector/inspections/new", icon: "pi pi-plus-circle", labelKey: "qualityInspector.nav.newInspection"},
        {to: "/inspector/parameters", icon: "pi pi-sliders-h", labelKey: "qualityInspector.nav.parameters"},
        {to: "/inspector/shrinkage-test", icon: "pi pi-chart-line", labelKey: "qualityInspector.nav.shrinkageTest"}
    ]
};

export const navItemsFor = (role) => NAV_ITEMS_BY_ROLE[role] ?? [];
