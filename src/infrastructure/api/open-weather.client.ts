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
      // Fetch current weather and forecast in parallel
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${this.baseUrl}/weather?q=${location}&units=metric&appid=${this.apiKey}`),
        fetch(`${this.baseUrl}/forecast?q=${location}&units=metric&appid=${this.apiKey}`)
      ]);

      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error(`Weather fetch failed (Current: ${currentRes.status}, Forecast: ${forecastRes.status})`);
      }

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      // Process forecast: Pick one measurement per day (roughly at noon)
      const dailyForecast = forecastData.list
        .filter((item: { dt_txt: string }) => item.dt_txt.includes("12:00:00"))
        .slice(0, 5)
        .map((item: { dt_txt: string; main: { temp: number }; weather: { main: string; icon: string }[] }) => ({
          date: item.dt_txt.split(" ")[0],
          avgTemp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          icon: item.weather[0].icon,
        }));

      return {
        location: currentData.name,
        temperature: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        pressure: currentData.main.pressure,
        lat: currentData.coord?.lat,
        lon: currentData.coord?.lon,
        forecast: dailyForecast
      };
    } catch (error) {
      console.error("OpenWeatherClient Error:", error);
      // Fallback to mock with the requested location name
      return { ...MOCK_WEATHER, location };
    }
  }

  async reverseGeocode(lat: number, lon: number): Promise<string> {
    if (!this.apiKey || this.apiKey === "MOCK") {
      return "London"; // Standard mock fallback
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
      );

      if (!response.ok) throw new Error("Reverse geocoding failed");

      const data = await response.json();
      return data[0]?.name || "London";
    } catch (error) {
      console.error("ReverseGeocode Error:", error);
      return "London";
    }
  }
}
