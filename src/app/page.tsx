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
          <button 
            onClick={() => {
              if (data?.weather.lat && data?.weather.lon) {
                window.open(`https://zoom.earth/maps/satellite/#view=${data.weather.lat},${data.weather.lon},10z`, '_blank');
              }
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Live Satellite
          </button>
          <button 
            onClick={() => document.getElementById('weather-hero')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Air Quality
          </button>
          <button 
            onClick={() => document.getElementById('weather-map')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Global Map
          </button>
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
            <div id="weather-hero">
              <WeatherHero data={data.weather} />
            </div>
            <WeatherInsights insights={data.insights} />
            <ForecastGrid forecast={data.weather.forecast} />
            <div id="weather-map">
              <WeatherMap location={data.weather.location} lat={data.weather.lat} lon={data.weather.lon} />
            </div>
            <WeatherVideos videos={data.videos} />
          </>
        )}
      </main>

      {/* Footer / Required Branding */}
      <footer className="w-full p-10 flex flex-col items-center gap-12 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="text-accent" size={20} />
              <h3 className="text-lg font-bold text-white/90">WeatherSuite Intelligence</h3>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-md">
              A high-performance weather intelligence platform developed by <span className="text-white/80 font-semibold">Leul Abera</span> for the PM Accelerator AI Engineer Intern Assessment. 
              Built with Next.js, Gemini AI, and Clean Architecture principles.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-accent uppercase tracking-widest">About PM Accelerator</h3>
            <p className="text-white/30 text-xs leading-relaxed italic">
              The Product Manager Accelerator program is designed to help students and professionals land their dream product management jobs in tech. 
              The program provides hands-on experience by having participants build real-world AI products, preparing them for the most competitive roles in the industry.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl pt-8 border-t border-white/5 text-white/20 text-[10px] uppercase tracking-[0.2em]">
          <p>© 2024 WeatherSuite Intelligence • Leul Abera</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span className="hover:text-accent cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-accent cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-accent cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
