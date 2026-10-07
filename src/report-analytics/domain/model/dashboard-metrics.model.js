export class DashboardMetrics {
    constructor({
                    totalProduced = 0,
                    averagePerHour = 0,
                    dailyCompliance = 0,
                    selectedDate = '2026-10-04',
                    selectedBatch = 'All batches'
                } = {}) {
        this.totalProduced = totalProduced;
        this.averagePerHour = averagePerHour;
        this.dailyCompliance = dailyCompliance;
        this.selectedDate = selectedDate;
        this.selectedBatch = selectedBatch;
    }
}