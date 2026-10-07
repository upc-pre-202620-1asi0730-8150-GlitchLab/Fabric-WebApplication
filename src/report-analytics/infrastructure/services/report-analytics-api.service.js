import axios from 'axios';
import { DashboardMetrics } from '../../domain/model/dashboard-metrics.model';

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

export class ReportAnalyticsApiService {
    async getDashboardData(date) {
        try {
            const response = await http.get('/dashboard', { params: { date } });

            const rawData = Array.isArray(response.data) ? response.data[0] : response.data;

            const metricData = rawData || {
                totalProduced: 0,
                averagePerHour: 0,
                dailyCompliance: 0,
                selectedDate: date
            };

            return new DashboardMetrics(metricData);
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