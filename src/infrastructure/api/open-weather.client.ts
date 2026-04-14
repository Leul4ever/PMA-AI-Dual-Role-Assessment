import { IWeatherProvider } from "../../domain/interfaces/weather-provider.interface";
import { WeatherEntity } from "../../domain/entities/weather.entity";

const MOCK_WEATHER: WeatherEntity = {
  location: "Mock City",
  temperature: 22,
  condition: "Cloudy",
  description: "Partly cloudy with a chance of rain",
  icon: "03d",
  humidity: 45,
  windSpeed: 10,
  pressure: 1012,
  forecast: [
    { date: "2024-04-15", avgTemp: 23, condition: "Sunny", icon: "01d" },
    { date: "2024-04-16", avgTemp: 21, condition: "Rain", icon: "09d" },
    { date: "2024-04-17", avgTemp: 19, condition: "Cloudy", icon: "04d" },
    { date: "2024-04-18", avgTemp: 24, condition: "Sunny", icon: "01d" },
    { date: "2024-04-19", avgTemp: 22, condition: "Partly Cloudy", icon: "02d" },
  ]
};

export class OpenWeatherClient implements IWeatherProvider {
  private apiKey = process.env.OPENWEATHER_API_KEY;
  private baseUrl = "https://api.openweathermap.org/data/2.5";

  async getWeather(location: string): Promise<WeatherEntity> {
    if (!this.apiKey || this.apiKey === "MOCK") {
      return { ...MOCK_WEATHER, location };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${location}&units=metric&appid=${this.apiKey}`
      );

      if (!response.ok) throw new Error("Weather fetch failed");

      const data = await response.json();
      
      return {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
      };
    } catch (error) {
      console.error("OpenWeatherClient Error:", error);
      return { ...MOCK_WEATHER, location };
    }
  }
}
