import {useSessionStore} from "../application/session.store.js";
import {USER_ROLES} from "../domain/model/user-role.js";
import {homeRouteNameFor} from "./role-options.js";

const LOGIN_ROUTE_NAME = 'role-selection';
const DEFAULT_REQUIRED_ROLE = USER_ROLES.PRODUCTION_SUPERVISOR;

export const authGuard = (to) => {
    const session = useSessionStore();

    if (to.meta.guestOnly) {
        return session.isAuthenticated ? {name: homeRouteNameFor(session.role)} : true;
    }
    if (to.meta.public) return true;
    if (!session.isAuthenticated) return {name: LOGIN_ROUTE_NAME};

    const requiredRole = to.meta.role ?? DEFAULT_REQUIRED_ROLE;
    return session.role === requiredRole ? true : {name: homeRouteNameFor(session.role)};
};

export const withRole = (role, routes) =>
    routes.map((route) => ({...route, meta: {...route.meta, role}}));
