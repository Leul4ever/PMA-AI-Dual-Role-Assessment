import { WeatherEntity } from "../entities/weather.entity";

export interface IAIProvider {
  generateInsights(weather: WeatherEntity): Promise<string>;
}
