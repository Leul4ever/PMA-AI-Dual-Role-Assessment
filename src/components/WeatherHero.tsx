import React from "react";
import { WeatherEntity } from "@/domain/entities/weather.entity";
import { GlassCard } from "./ui/GlassCard";
import { Droplets, Wind, Gauge, CloudRain, Sun, Cloud, CloudLightning } from "lucide-react";

interface WeatherHeroProps {
  data: WeatherEntity;
}

const WeatherIcon = ({ condition, size = 64 }: { condition: string; size?: number }) => {
  const cond = condition.toLowerCase();
  if (cond.includes("sun") || cond.includes("clear")) return <Sun size={size} className="text-yellow-400" />;
  if (cond.includes("rain") || cond.includes("drizzle")) return <CloudRain size={size} className="text-blue-400" />;
  if (cond.includes("storm") || cond.includes("thunder")) return <CloudLightning size={size} className="text-purple-400" />;
  return <Cloud size={size} className="text-slate-300" />;
};

export const WeatherHero: React.FC<WeatherHeroProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-8 py-10">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h2 className="text-3xl font-bold text-white/90">{data.location}</h2>
          <div className="flex items-center gap-4">
            <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 leading-none">
              {data.temperature}°
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-accent">{data.condition}</span>
              <span className="text-white/50 capitalize">{data.description}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center p-6 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/5">
          <WeatherIcon condition={data.condition} size={120} />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex items-center gap-4 py-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-white/40 text-sm">Humidity</p>
            <p className="text-white font-semibold">{data.humidity}%</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 py-4">
          <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
            <Wind size={24} />
          </div>
          <div>
            <p className="text-white/40 text-sm">Wind Speed</p>
            <p className="text-white font-semibold">{data.windSpeed} km/h</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 py-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <Gauge size={24} />
          </div>
          <div>
            <p className="text-white/40 text-sm">Pressure</p>
            <p className="text-white font-semibold">{data.pressure} hPa</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
