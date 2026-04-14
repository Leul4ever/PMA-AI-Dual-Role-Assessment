import React from "react";
import { ForecastDayEntity } from "@/domain/entities/weather.entity";
import { GlassCard } from "./ui/GlassCard";
import { Cloud, Sun, CloudRain } from "lucide-react";

interface ForecastGridProps {
  forecast?: ForecastDayEntity[];
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  const cond = condition.toLowerCase();
  if (cond.includes("sun") || cond.includes("clear")) return <Sun size={24} className="text-yellow-400" />;
  if (cond.includes("rain")) return <CloudRain size={24} className="text-blue-400" />;
  return <Cloud size={24} className="text-slate-300" />;
};

export const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  if (!forecast) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
      <h3 className="text-sm font-medium tracking-wider uppercase text-white/60 px-2">5-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {forecast.map((day, idx) => (
          <GlassCard key={idx} className="flex flex-col items-center justify-center py-6 space-y-3 glass-hover">
            <p className="text-xs text-white/40 font-medium">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <WeatherIcon condition={day.condition} />
            <div className="text-center">
              <p className="text-xl font-bold text-white">{day.avgTemp}°</p>
              <p className="text-[10px] text-white/40 uppercase tracking-tighter">{day.condition}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
