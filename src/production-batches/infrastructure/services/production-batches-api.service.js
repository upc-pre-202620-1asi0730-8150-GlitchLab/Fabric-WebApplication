/**
 * @summary Infrastructure resource service handling HTTP communication with REST API via Axios.
 * @author Diego Sebastian Reategui Galarcep (u20201F165)
 */

import axios from 'axios';
import { ProductionBatch } from '../../domain/model/production-batch.entity.js';
import { BatchOperator } from '../../domain/model/batch-operator.entity.js';
import { BatchMovement } from '../../domain/model/batch-movement.entity.js';
import { BatchObservation } from '../../domain/model/batch-observation.entity.js';


const http = axios.create({
    // Ejemplo de baseUrl en production-batches-api.service.js
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export class ProductionBatchesApiService {

    /**
     * Obtiene la lista completa de lotes de producción.
     * @returns {Promise<ProductionBatch[]>} Lista de entidades de dominio ProductionBatch.
     */
    async getAllBatches() {
        try {
            const response = await http.get('/production-batches');
            return response.data.map(item => new ProductionBatch(item));
        } catch (error) {
            console.error('Error fetching production batches:', error);
            throw error;
        }
    }

    /**
     * Obtiene un lote de producción por su ID.
     * @param {number|string} id - Identificador del lote.
     * @returns {Promise<ProductionBatch>} Instancia de la entidad ProductionBatch.
     */
    async getBatchById(id) {
        try {
            const response = await http.get(`/production-batches/${id}`);
            return new ProductionBatch(response.data);
        } catch (error) {
            console.error(`Error fetching batch with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Crea un nuevo lote de producción.
     * @param {Object} batchData - Datos del formulario de creación.
     * @returns {Promise<ProductionBatch>} Lote creado mapeado a entidad.
     */
    async createBatch(batchData) {
        try {
            const response = await http.post('/production-batches', batchData);
            return new ProductionBatch(response.data);
        } catch (error) {
            console.error('Error creating production batch:', error);
            throw error;
        }
    }

    /**
     * Actualiza la etapa actual o el estado de un lote.
     * @param {number|string} batchId - Identificador del lote.
     * @param {Object} updateData - Campos a actualizar (currentStage, progressPercentage, status).
     * @returns {Promise<ProductionBatch>}
     */
    async updateBatchStatus(batchId, updateData) {
        try {
            const response = await http.patch(`/production-batches/${batchId}`, updateData);
            return new ProductionBatch(response.data);
        } catch (error) {
            console.error(`Error updating stage for batch ${batchId}:`, error);
            throw error;
        }
    }

    /**
     * Obtiene los operarios asignados a un lote específico.
     * @param {number|string} batchId - Identificador del lote.
     * @returns {Promise<BatchOperator[]>} Lista de operarios asignados.
     */
    async getOperatorsByBatchId(batchId) {
        try {
            const response = await http.get(`/batch-operators?batchId=${batchId}`);
            return response.data.map(item => new BatchOperator(item));
        } catch (error) {
            console.error(`Error fetching operators for batch ${batchId}:`, error);
            throw error;
        }
    }

    /**
     * Asigna un operario a una etapa de un lote.
     * @param {Object} operatorData - Datos de la asignación.
     * @returns {Promise<BatchOperator>}
     */
    async assignOperator(operatorData) {
        try {
            const response = await http.post('/batch-operators', operatorData);
            return new BatchOperator(response.data);
        } catch (error) {
            console.error('Error assigning operator to batch stage:', error);
            throw error;
        }
    }

    /**
     * Obtiene el historial de movimientos de prendas/cantidades de un lote.
     * @param {number|string} batchId - Identificador del lote.
     * @returns {Promise<BatchMovement[]>} Lista de movimientos registrados.
     */
    async getMovementsByBatchId(batchId) {
        try {
            const response = await http.get(`/batch-movements?batchId=${batchId}`);
            return response.data.map(item => new BatchMovement(item));
        } catch (error) {
            console.error(`Error fetching movements for batch ${batchId}:`, error);
            throw error;
        }
    }

    /**
     * Registra un nuevo movimiento de entrada/salida entre etapas.
     * @param {Object} movementData - Datos del movimiento (qtyIn, qtyOut, stageName, etc.).
     * @returns {Promise<BatchMovement>}
     */
    async registerMovement(movementData) {
        try {
            const response = await http.post('/batch-movements', movementData);
            return new BatchMovement(response.data);
        } catch (error) {
            console.error('Error registering batch movement:', error);
            throw error;
        }
    }

    /**
     * Obtiene las observaciones registradas para un lote.
     * @param {number|string} batchId - Identificador del lote.
     * @returns {Promise<BatchObservation[]>} Lista de observaciones.
     */
    async getObservationsByBatchId(batchId) {
        try {
            const response = await http.get(`/batch-observations?batchId=${batchId}`);
            return response.data.map(item => new BatchObservation(item));
        } catch (error) {
            console.error(`Error fetching observations for batch ${batchId}:`, error);
            throw error;
        }
    }

    /**
     * Registra una nueva observación operativa para un lote.
     * @param {Object} observationData - Contenido de la observación, autor y categoría.
     * @returns {Promise<BatchObservation>}
     */
    async createObservation(observationData) {
        try {
            const response = await http.post('/batch-observations', observationData);
            return new BatchObservation(response.data);
        } catch (error) {
            console.error('Error creating observation:', error);
            throw error;
        }
    }
}