export const USER_ROLES = Object.freeze({
    QUALITY_INSPECTOR: 'quality-inspector',
    PRODUCTION_SUPERVISOR: 'production-supervisor'
});

export const isUserRole = (value) => Object.values(USER_ROLES).includes(value);
