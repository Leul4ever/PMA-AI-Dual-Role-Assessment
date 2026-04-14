import { VideoEntity } from "../entities/weather.entity";

export interface IVideoProvider {
  getVideos(location: string): Promise<VideoEntity[]>;
}
