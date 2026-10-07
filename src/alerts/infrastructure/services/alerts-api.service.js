import { http } from '../../../shared/infrastructure/base-api.js';
import { Alert } from '../../domain/model/alert.model.js';

export class AlertsApiService {
    async getAll() {
        try {
            const response = await http.get('/alerts');
            return response.data.map(item => new Alert(item));
        } catch (error) {
            console.error('Error fetching alerts in infrastructure layer:', error);
            throw error;
        }
    }
}
