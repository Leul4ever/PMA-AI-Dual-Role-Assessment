"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { WeatherHero } from "@/components/WeatherHero";
import { ForecastGrid } from "@/components/ForecastGrid";
import { WeatherVideos } from "@/components/WeatherVideos";
import { WeatherMap } from "@/components/WeatherMap";
import { WeatherInsights } from "@/components/WeatherInsights";
import { HistorySidebar } from "@/components/HistorySidebar";
import { useWeather } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Cloud, MapPin, Zap } from "lucide-react";

export default function Home() {
  const { data, loading, error, fetchWeather } = useWeather();
  const { coords, error: geoError } = useGeolocation();
  const [hasAutoDetected, setHasAutoDetected] = useState(false);

  // Auto-detect weather on load using geolocation
  useEffect(() => {
    const detectWeather = async () => {
      if (coords && !hasAutoDetected && !data) {
        setHasAutoDetected(true);
        await fetchWeather({ lat: coords.latitude, lon: coords.longitude });
      } else if (geoError && !hasAutoDetected && !data) {
        setHasAutoDetected(true);
        fetchWeather("London"); // Fallback for demo
      }
    };
    
    detectWeather();
  }, [coords, geoError, hasAutoDetected, data, fetchWeather]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <HistorySidebar />
      {/* Header / Branding */}
      <header className="w-full flex items-center justify-between p-6 px-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-accent/20 rounded-xl group-hover:bg-accent/30 transition-colors">
            <Zap className="text-accent" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white/90">
            Weather<span className="text-accent">Suite</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
          <p className="hover:text-white transition-colors cursor-pointer">Live Satellite</p>
          <p className="hover:text-white transition-colors cursor-pointer">Air Quality</p>
          <p className="hover:text-white transition-colors cursor-pointer">Global Map</p>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1 flex flex-col items-center px-6 py-8 space-y-12">
        <div className="w-full max-w-2xl text-center space-y-4">
          <SearchBar onSearch={fetchWeather} loading={loading} />
          {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}
          {!data && !loading && (
            <div className="pt-20 space-y-4 opacity-40">
              <Cloud size={64} className="mx-auto" />
              <p className="text-lg font-medium">Search for a location to get started</p>
            </div>
          )}
        </div>

        {data && (
          <>
            <WeatherHero data={data.weather} />
            <WeatherInsights insights={data.insights} />
            <ForecastGrid forecast={data.weather.forecast} />
            <WeatherMap location={data.weather.location} lat={data.weather.lat} lon={data.weather.lon} />
            <WeatherVideos videos={data.videos} />
          </>
        )}
      </main>

      {/* Footer / Required Branding */}
      <footer className="w-full p-8 px-10 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Zap className="text-accent/40" size={16} />
          <p className="text-white/20 text-xs font-medium tracking-widest uppercase">WeatherSuite Intelligence</p>
        </div>
        
        <div className="mt-6 md:mt-0 flex items-center gap-8 text-white/40 text-xs uppercase tracking-widest">
          <span className="hover:text-accent cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-accent cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-accent cursor-pointer transition-colors">Support</span>
        </div>
      </footer>
    </div>
  );
}
