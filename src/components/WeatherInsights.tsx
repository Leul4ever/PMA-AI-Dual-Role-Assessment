import React from "react";
import { GlassCard } from "./ui/GlassCard";
import { Sparkles } from "lucide-react";

interface WeatherInsightsProps {
  insights?: string;
}

export const WeatherInsights: React.FC<WeatherInsightsProps> = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
      <div className="flex items-center justify-between text-white/60 px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="text-accent animate-pulse" size={20} />
          <h3 className="text-sm font-medium tracking-wider uppercase">Agentic AI Analyst</h3>
        </div>
      </div>
      
      <GlassCard className="p-6 relative overflow-hidden group border-accent/20 hover:border-accent/40 transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <p className="text-white/90 leading-relaxed text-lg font-light relative z-10 font-sans tracking-wide">
          {insights}
        </p>
      </GlassCard>
    </div>
  );
};
