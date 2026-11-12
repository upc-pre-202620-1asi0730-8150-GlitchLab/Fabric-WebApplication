import { http } from '../../../shared/infrastructure/base-api.js';
import { DashboardMetrics } from '../../domain/model/dashboard-metrics.model.js';

const METRICS_PATH = '/dashboard-metrics';

export class ReportAnalyticsApiService {
    async getDashboardData(date) {
        try {
            const response = await http.get(METRICS_PATH, { params: { date } });
            return new DashboardMetrics({ ...response.data, selectedDate: date });
        } catch (error) {
            console.error('Error fetching dashboard analytics:', error);
            throw error;
        }
    }

    async getDashboardHistory() {
        try {
            const response = await http.get(`${METRICS_PATH}/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard history:', error);
            throw error;
        }
    }
}
