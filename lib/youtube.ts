// 유튜브 영상 목록(data/youtube-videos.json)을 꺼내 주는 함수입니다.
import data from "@/data/youtube-videos.json";

export type Video = {
  id: string;
  title: string;
  published: string;
  url: string;
  thumbnail: string;
};

const allVideos = data.videos as Video[];

export function getVideos(limit?: number): Video[] {
  return limit ? allVideos.slice(0, limit) : allVideos;
}