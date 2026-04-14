import { useState } from "react";
import { WeatherDashboardEntity } from "@/domain/entities/weather.entity";

export const useWeather = () => {
  const [data, setData] = useState<WeatherDashboardEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
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
