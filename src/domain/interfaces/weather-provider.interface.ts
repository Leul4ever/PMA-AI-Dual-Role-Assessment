import { WeatherEntity } from "../entities/weather.entity";

export interface IWeatherProvider {
  getWeather(location: string): Promise<WeatherEntity>;
}
