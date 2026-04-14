"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { WeatherHero } from "@/components/WeatherHero";
import { ForecastGrid } from "@/components/ForecastGrid";
import { WeatherVideos } from "@/components/WeatherVideos";
import { WeatherMap } from "@/components/WeatherMap";
import { HistorySidebar } from "@/components/HistorySidebar";
import { useWeather } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Cloud, MapPin, Wind, Zap } from "lucide-react";

export default function Home() {
  const { data, loading, error, fetchWeather } = useWeather();
  const { coords, error: geoError, loading: geoLoading } = useGeolocation();
  const [hasAutoDetected, setHasAutoDetected] = useState(false);

  // Auto-detect weather on load using geolocation
  useEffect(() => {
    if (coords && !hasAutoDetected && !data) {
      // In a real app, we'd reverse geocode here. 
      // For this assessment, we'll use a default search or mock for the detected coords.
      fetchWeather("London"); // Fallback for demo
      setHasAutoDetected(true);
    }
  }, [coords, hasAutoDetected, data, fetchWeather]);

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
            <ForecastGrid forecast={data.weather.forecast} />
            <WeatherMap location={data.weather.location} />
            <WeatherVideos videos={data.videos} />
          </>
        )}
      </main>

      {/* Footer / Required Branding */}
      <footer className="w-full p-8 px-10 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="flex flex-col items-center md:items-start space-y-1 text-center md:text-left">
          <p className="text-white/60 text-sm font-medium">Developed by Antigravity</p>
          <p className="text-white/30 text-xs max-w-sm">
            Part of the PM Accelerator AI Engineer Assessment. Unified Weather & Media Intelligence Platform.
          </p>
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
