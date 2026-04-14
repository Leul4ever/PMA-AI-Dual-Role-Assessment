import { WeatherEntity, WeatherHistoryEntity } from "../entities/weather.entity";

export interface IWeatherHistoryRepository {
  save(weather: WeatherEntity): Promise<void>;
  getHistory(limit?: number): Promise<WeatherHistoryEntity[]>;
  clearAll(): Promise<void>;
  deleteById(id: number): Promise<void>;
}
