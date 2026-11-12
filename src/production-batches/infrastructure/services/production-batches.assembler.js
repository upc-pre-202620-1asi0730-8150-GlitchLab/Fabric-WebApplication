import { BatchMovement } from '../../domain/model/batch-movement.entity.js';
import { BatchObservation } from '../../domain/model/batch-observation.entity.js';
import { BatchOperator } from '../../domain/model/batch-operator.entity.js';
import { ProductionBatch } from '../../domain/model/production-batch.entity.js';

const formatDateTime = (value) => value ? new Date(value).toLocaleString() : value;

export const toProductionBatch = (data) => new ProductionBatch({
    ...data,
    deliveryDate: String(data.deliveryDate ?? '').slice(0, 10)
});

export const toBatchMovement = (data) => new BatchMovement({
    ...data,
    stageName: data.stageName || data.stage,
    timestamp: formatDateTime(data.timestamp || data.dateTime),
    responsiblePerson: data.responsiblePerson || data.responsible
});

export const toBatchObservation = (data) => new BatchObservation({
    ...data,
    authorName: data.authorName || data.author,
    content: data.content || data.text,
    createdAt: formatDateTime(data.createdAt || data.timestamp),
    timestamp: formatDateTime(data.timestamp)
});

export const toBatchOperator = (data) => new BatchOperator({
    ...data,
    fullName: data.fullName || data.operatorName,
    assignedStage: data.assignedStage || data.stage,
    assignmentDate: formatDateTime(data.assignmentDate || data.assignedAt),
    assignedAt: formatDateTime(data.assignedAt || data.assignmentDate)
});

export const toObservationPayload = (observation) => ({
    batchId: observation.batchId,
    timestamp: observation.timestamp,
    text: observation.text,
    author: observation.author
});

export const toOperatorAssignmentPayload = (operator) => ({
    batchId: operator.batchId,
    operatorName: operator.operatorName,
    specialty: operator.specialty,
    stage: operator.stage,
    assignedAt: operator.assignedAt
});
