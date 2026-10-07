import { http } from '../../../shared/infrastructure/base-api.js';
import { DashboardMetrics } from '../../domain/model/dashboard-metrics.model.js';

export class ReportAnalyticsApiService {
    async getDashboardData(date) {
        try {
            const response = await http.get('/dashboard', { params: { date } });
            const rawData = Array.isArray(response.data) ? response.data[0] : response.data;
            return new DashboardMetrics({ ...(rawData || {}), selectedDate: date });
        } catch (error) {
            console.error('Error fetching dashboard analytics:', error);
            throw error;
        }
    }

    async getDashboardHistory() {
        try {
            const response = await http.get('/dashboard');
            return response.data
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date));
        } catch (error) {
            console.error('Error fetching dashboard history:', error);
            throw error;
        }
    }
}
