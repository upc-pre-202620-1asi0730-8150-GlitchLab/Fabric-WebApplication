import {useSessionStore} from "../application/session.store.js";
import {USER_ROLES} from "../domain/model/user-role.js";
import {homeRouteNameFor} from "./role-options.js";

const LOGIN_ROUTE_NAME = 'role-selection';
const DEFAULT_REQUIRED_ROLE = USER_ROLES.PRODUCTION_SUPERVISOR;

/**
 * Route meta flags:
 *  - guestOnly: only reachable without a session (role selection).
 *  - public: reachable always (404).
 *  - role: role required to enter; defaults to production supervisor.
 */
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
