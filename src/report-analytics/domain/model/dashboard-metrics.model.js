export class DashboardMetrics {
    constructor({
                    totalProduced = 0,
                    averagePerHour = 0,
                    dailyCompliance = 0,
                    selectedDate = null,
                    selectedBatch = null
                } = {}) {
        this.totalProduced = totalProduced;
        this.averagePerHour = averagePerHour;
        this.dailyCompliance = dailyCompliance;
        this.selectedDate = selectedDate;
        this.selectedBatch = selectedBatch;
    }
}