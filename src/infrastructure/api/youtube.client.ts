import { IVideoProvider } from "../../domain/interfaces/video-provider.interface";
import { VideoEntity } from "../../domain/entities/weather.entity";

const MOCK_VIDEOS: VideoEntity[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Understanding the Weather Patterns in your area",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    channelTitle: "Weather News"
  },
  {
    id: "9bZkp7q19f0",
    title: "Best travel spots with great weather today",
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    channelTitle: "Traveler Channel"
  }
];

export class YouTubeClient implements IVideoProvider {
  private apiKey = process.env.YOUTUBE_API_KEY;
  private baseUrl = "https://www.googleapis.com/youtube/v3";

  async getVideos(location: string): Promise<VideoEntity[]> {
    if (!this.apiKey || this.apiKey === "MOCK") {
      return MOCK_VIDEOS;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&maxResults=3&q=${encodeURIComponent(
          `weather and travel in ${location}`
        )}&type=video&key=${this.apiKey}`
      );

      if (!response.ok) throw new Error("YouTube fetch failed");

      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
      }));
    } catch (error) {
      console.error("YouTubeClient Error:", error);
      return MOCK_VIDEOS;
    }
  }
}
