import React from "react";
import { VideoEntity } from "@/domain/entities/weather.entity";
import { GlassCard } from "./ui/GlassCard";
import { Play } from "lucide-react";

interface WeatherVideosProps {
  videos: VideoEntity[];
}

export const WeatherVideos: React.FC<WeatherVideosProps> = ({ videos }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex items-center gap-2 text-white/60 px-2">
        <Play className="text-accent" size={20} />
        <h3 className="text-sm font-medium tracking-wider uppercase">Relevant Videos & Guides</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <GlassCard key={video.id} className="p-0 overflow-hidden glass-hover group">
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="text-white font-medium line-clamp-2 leading-relaxed">
                  {video.title}
                </h4>
                <p className="text-white/40 text-xs truncate">{video.channelTitle}</p>
              </div>
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
