export interface WeatherEntity {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  lat?: number;
  lon?: number;
  aqi?: number;
  forecast?: ForecastDayEntity[];
}

export interface ForecastDayEntity {
  date: string;
  avgTemp: number;
  condition: string;
  icon: string;
}

export interface VideoEntity {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export interface WeatherDashboardEntity {
  weather: WeatherEntity;
  videos: VideoEntity[];
  insights?: string;
  timestamp: string;
}

export interface WeatherHistoryEntity extends WeatherEntity {
  id: number;
  recordedAt: Date;
}
