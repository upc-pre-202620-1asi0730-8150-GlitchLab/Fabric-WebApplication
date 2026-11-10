import {USER_ROLES} from "../domain/model/user-role.js";

export const ROLE_OPTIONS = [
    {
        role: USER_ROLES.QUALITY_INSPECTOR,
        labelKey: 'identityAccess.roleSelection.roles.qualityInspector',
        icon: 'pi pi-verified',
        homeRouteName: 'quality-inspector-home'
    },
    {
        role: USER_ROLES.PRODUCTION_SUPERVISOR,
        labelKey: 'identityAccess.roleSelection.roles.productionSupervisor',
        icon: 'pi pi-box',
        homeRouteName: 'dashboard'
    }
];

export const homeRouteNameFor = (role) =>
    ROLE_OPTIONS.find((option) => option.role === role)?.homeRouteName;
