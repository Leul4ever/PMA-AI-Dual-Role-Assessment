import { useState } from "react";
import { WeatherDashboardEntity } from "@/domain/entities/weather.entity";

export const useWeather = () => {
  const [data, setData] = useState<WeatherDashboardEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (params: string | { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    try {
      const url = typeof params === "string" 
        ? `/api/weather?city=${encodeURIComponent(params)}`
        : `/api/weather?lat=${params.lat}&lon=${params.lon}`;
        
      const response = await fetch(url);
      if (!response.ok) throw new Error("Could not find that location");
      const result = await response.json();
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchWeather };
};
