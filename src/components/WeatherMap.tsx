import React from "react";
import { GlassCard } from "./ui/GlassCard";
import { Map as MapIcon, Maximize2 } from "lucide-react";

interface WeatherMapProps {
  location: string;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({ location }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapUrl = apiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`
    : `https://www.google.com/maps/embed/v1/place?key=MOCK&q=${encodeURIComponent(location)}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
      <div className="flex items-center justify-between text-white/60 px-2">
        <div className="flex items-center gap-2">
          <MapIcon className="text-accent" size={20} />
          <h3 className="text-sm font-medium tracking-wider uppercase">Live Location Context</h3>
        </div>
        <button className="text-xs hover:text-white transition-colors flex items-center gap-1">
          <Maximize2 size={12} /> Expand
        </button>
      </div>
      
      <GlassCard className="p-0 overflow-hidden h-80 relative group">
        {!apiKey ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-10 text-center p-6 space-y-3">
            <MapIcon size={48} className="text-white/20" />
            <div>
              <p className="text-white/80 font-medium">Map Preview Restricted</p>
              <p className="text-white/40 text-xs">Google Maps API key required for full interaction</p>
            </div>
          </div>
        ) : (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          ></iframe>
        )}
        
        {/* Decorative Grid Overlay for premium feel */}
        {!apiKey && (
          <div className="absolute inset-0 pointer-events-none opacity-20" 
               style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
          />
        )}
      </GlassCard>
    </div>
  );
};
