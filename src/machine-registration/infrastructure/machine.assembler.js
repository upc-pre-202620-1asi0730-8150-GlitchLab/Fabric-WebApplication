import {Machine} from "../domain/model/machine.entity.js";
import {StopEvent} from "../domain/model/stop-event.entity.js";
import {MaintenanceRecord} from "../domain/model/maintenance-record.entity.js";
import {MACHINE_STATUS} from "../domain/model/machine-status.js";

const STATUS_FROM_API = {
    Operational: MACHINE_STATUS.OPERATIONAL,
    InMaintenance: MACHINE_STATUS.IN_MAINTENANCE,
    Stopped: MACHINE_STATUS.MACHINE_STOPPED
};

const STATUS_TO_API = Object.fromEntries(Object.entries(STATUS_FROM_API).map(([api, ui]) => [ui, api]));

const MAINTENANCE_TYPE_FROM_API = {Preventive: 'preventive', Corrective: 'corrective', Calibration: 'calibration'};
const MAINTENANCE_TYPE_TO_API = Object.fromEntries(Object.entries(MAINTENANCE_TYPE_FROM_API).map(([api, ui]) => [ui, api]));

const REASON_SEPARATOR = ': ';
const PARTS_SEPARATOR = ' | ';
const REASON_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 240;

const asUtc = (value) => {
    if (!value) return null;
    return /(Z|[+-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`;
};

export class MachineAssembler {
    static toEntityFromResource(resource) {
        return new Machine({
            id: resource.id,
            code: resource.code,
            type: resource.type,
            location: resource.location,
            acquiredDate: resource.acquiredDate,
            status: STATUS_FROM_API[resource.status] ?? MACHINE_STATUS.OPERATIONAL
        });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        return response.data.map(resource => this.toEntityFromResource(resource));
    }

    static toRegisterResource(machine) {
        return {
            code: machine.code,
            type: machine.type,
            location: machine.location,
            acquiredDate: machine.acquiredDate
        };
    }

    static toStatusResource(status) {
        return {status: STATUS_TO_API[status]};
    }

    static toStopEventFromResource(resource) {
        const separatorIndex = resource.reason.indexOf(REASON_SEPARATOR);
        const hasDescription = separatorIndex > -1;
        return new StopEvent({
            id: resource.id,
            machineId: resource.machineId,
            cause: hasDescription ? resource.reason.slice(0, separatorIndex) : resource.reason,
            stoppedAt: asUtc(resource.startTime),
            resumedAt: asUtc(resource.endTime),
            durationMinutes: resource.durationMinutes,
            failureDescription: hasDescription ? resource.reason.slice(separatorIndex + REASON_SEPARATOR.length) : null
        });
    }

    static toStopEventsFromResponse(response) {
        return response.data.map(resource => this.toStopEventFromResource(resource));
    }

    static toDowntimeResource({category, description, stoppedAt}) {
        const reason = description ? `${category}${REASON_SEPARATOR}${description}` : category;
        return {reason: reason.slice(0, REASON_MAX_LENGTH), startTime: stoppedAt};
    }

    static toResumeResource({resumedAt}) {
        return {endTime: resumedAt};
    }

    static toMaintenanceRecordFromResource(resource) {
        const separatorIndex = resource.description.indexOf(PARTS_SEPARATOR);
        const hasParts = separatorIndex > -1;
        return new MaintenanceRecord({
            id: resource.id,
            machineId: resource.machineId,
            date: resource.performedDate ? resource.performedDate.slice(0, 10) : '',
            maintenanceType: MAINTENANCE_TYPE_FROM_API[resource.maintenanceType] ?? 'corrective',
            interventionPerformed: hasParts ? resource.description.slice(0, separatorIndex) : resource.description,
            partsReplaced: hasParts ? resource.description.slice(separatorIndex + PARTS_SEPARATOR.length) : '',
            technician: resource.technician
        });
    }

    static toMaintenanceRecordsFromResponse(response) {
        return response.data.map(resource => this.toMaintenanceRecordFromResource(resource));
    }

    static toMaintenanceResource({date, maintenanceType, interventionPerformed, partsReplaced, technician}) {
        const description = partsReplaced ? `${interventionPerformed}${PARTS_SEPARATOR}${partsReplaced}` : interventionPerformed;
        return {
            technician,
            maintenanceType: MAINTENANCE_TYPE_TO_API[maintenanceType] ?? maintenanceType,
            description: description.slice(0, DESCRIPTION_MAX_LENGTH),
            performedDate: date ? new Date(date).toISOString() : null
        };
    }
}
