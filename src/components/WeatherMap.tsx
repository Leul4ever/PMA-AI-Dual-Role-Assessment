import React from "react";
import { GlassCard } from "./ui/GlassCard";
import { Map as MapIcon, Maximize2 } from "lucide-react";

interface WeatherMapProps {
  location: string;
  lat?: number;
  lon?: number;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({ location, lat, lon }) => {
  const geoapifyKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  // We use an iframe with Geoapify Map Tiles to show the area
  // Fallback: show OpenStreetMap static embed (no key needed) for basic display
  const mapSrc = geoapifyKey && lat && lon
    ? `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=800&height=400&center=lonlat:${lon},${lat}&zoom=11&apiKey=${geoapifyKey}`
    : lat && lon
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.2},${lat - 0.2},${lon + 0.2},${lat + 0.2}&layer=mapnik&marker=${lat},${lon}`
      : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
      <div className="flex items-center justify-between text-white/60 px-2">
        <div className="flex items-center gap-2">
          <MapIcon className="text-accent" size={20} />
          <h3 className="text-sm font-medium tracking-wider uppercase">Live Location Context</h3>
        </div>
        {mapSrc && (
          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=11/${lat}/${lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:text-white transition-colors flex items-center gap-1"
          >
            <Maximize2 size={12} /> Expand
          </a>
        )}
      </div>

      <GlassCard className="p-0 overflow-hidden h-80 relative group">
        {mapSrc ? (
          geoapifyKey && lat && lon ? (
            /* Geoapify Static Map Image */
            <img
              src={mapSrc}
              alt={`Map of ${location}`}
              className="w-full h-full object-cover"
            />
          ) : (
            /* OpenStreetMap iframe fallback */
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={mapSrc}
            />
          )
        ) : (
          /* No coordinates available */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-10 text-center p-6 space-y-3">
            <MapIcon size={48} className="text-white/20" />
            <div>
              <p className="text-white/80 font-medium">Map for {location}</p>
              <p className="text-white/40 text-xs mt-1">Coordinates unavailable for map preview</p>
            </div>
          </div>
        )}

        {/* Decorative frame overlay */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
      </GlassCard>
    </div>
  );
};
