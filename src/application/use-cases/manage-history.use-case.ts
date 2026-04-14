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
}
