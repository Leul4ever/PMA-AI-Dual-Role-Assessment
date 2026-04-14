import { IWeatherProvider } from "../../domain/interfaces/weather-provider.interface";
import { IVideoProvider } from "../../domain/interfaces/video-provider.interface";
import { IWeatherHistoryRepository } from "../../domain/interfaces/weather-history.repository";
import { WeatherDashboardEntity } from "../../domain/entities/weather.entity";

export class GetWeatherDashboardUseCase {
  constructor(
    private weatherProvider: IWeatherProvider,
    private videoProvider: IVideoProvider,
    private historyRepository: IWeatherHistoryRepository
  ) {}

  async execute(location: string): Promise<WeatherDashboardEntity> {
    const [weather, videos] = await Promise.all([
      this.weatherProvider.getWeather(location),
      this.videoProvider.getVideos(location),
    ]);

    // Side effect: save to history
    await this.historyRepository.save(weather);

    return {
      weather,
      videos,
      timestamp: new Date().toISOString(),
    };
  }
}
