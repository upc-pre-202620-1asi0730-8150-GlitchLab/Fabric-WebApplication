import axios from 'axios';
import { Alert } from '../../domain/model/alert.model.js';

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

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