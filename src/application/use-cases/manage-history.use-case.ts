import { IWeatherHistoryRepository } from "../../domain/interfaces/weather-history.repository";

export class ManageHistoryUseCase {
  constructor(private historyRepository: IWeatherHistoryRepository) {}

  async getHistory(limit?: number) {
    return this.historyRepository.getHistory(limit);
  }

  async clearHistory() {
    return this.historyRepository.clearAll();
  }

  async deleteRecord(id: number) {
    return this.historyRepository.deleteById(id);
  }

  async updateRecord(id: number, newLocation: string) {
    return this.historyRepository.updateLocation(id, newLocation);
  }

  async exportData(format: "json" | "csv") {
    const history = await this.historyRepository.getHistory(100); // Export last 100 records
    
    if (format === "json") {
      return JSON.stringify(history, null, 2);
    } else {
      // Very simple CSV conversion
      const headers = "ID,Location,Temp,Condition,Date\n";
      const rows = history
        .map(r => `${r.id},"${r.location}",${r.temperature},"${r.condition}",${r.recordedAt?.toISOString()}`)
        .join("\n");
      return headers + rows;
    }
  }
}
