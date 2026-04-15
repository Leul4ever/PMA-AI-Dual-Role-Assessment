import { IWeatherProvider } from "../../domain/interfaces/weather-provider.interface";
import { IVideoProvider } from "../../domain/interfaces/video-provider.interface";
import { IWeatherHistoryRepository } from "../../domain/interfaces/weather-history.repository";
import { IAIProvider } from "../../domain/interfaces/ai-provider.interface";
import { WeatherDashboardEntity } from "../../domain/entities/weather.entity";

export class GetWeatherDashboardUseCase {
  constructor(
    private weatherProvider: IWeatherProvider,
    private videoProvider: IVideoProvider,
    private historyRepository: IWeatherHistoryRepository,
    private aiProvider: IAIProvider
  ) {}

  async execute(location: string): Promise<WeatherDashboardEntity> {
    const [weather, videos] = await Promise.all([
      this.weatherProvider.getWeather(location),
      this.videoProvider.getVideos(location),
    ]);

    // Side effect: save to history
    await this.historyRepository.save(weather);

    // Get insights (requires weather data)
    const insights = await this.aiProvider.generateInsights(weather);

    return {
      weather,
      videos,
      insights,
      timestamp: new Date().toISOString(),
    };
  }
}
