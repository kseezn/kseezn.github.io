// 유튜브 영상 목록(data/youtube-videos.json)과 채널 목록(data/youtube-channels.json)을 꺼내 주는 함수입니다.
import channelData from "@/data/youtube-channels.json";
import data from "@/data/youtube-videos.json";

export type Video = {
  id: string;
  title: string;
  published: string;
  url: string;
  thumbnail: string;
  channel?: string; // 영상이 올라온 채널 ID
  channelName?: string; // 채널 이름
};

export type Channel = { name: string; url: string; id: string };

const allVideos = data.videos as Video[];

// 여러 채널 영상이 섞여 최신순으로 들어 있습니다.
export function getVideos(limit?: number): Video[] {
  return limit ? allVideos.slice(0, limit) : allVideos;
}

// 주소가 적힌 채널만 (영상 페이지의 '채널 바로가기' 버튼에 씀)
export function getChannels(): Channel[] {
  return (channelData.channels as Channel[]).filter((channel) => channel.url);
}