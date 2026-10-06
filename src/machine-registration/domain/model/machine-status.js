export const MACHINE_STATUS = {
    OPERATIONAL: 'operational',
    MACHINE_STOPPED: 'machine-stopped',
    IN_MAINTENANCE: 'in-maintenance'
};

export const MACHINE_STATUS_SEVERITY = {
    [MACHINE_STATUS.OPERATIONAL]: 'success',
    [MACHINE_STATUS.MACHINE_STOPPED]: 'secondary',
    [MACHINE_STATUS.IN_MAINTENANCE]: 'warning'
};