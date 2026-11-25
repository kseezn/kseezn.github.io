import type { Metadata } from "next";
import { ContactBand, PageHero } from "@/components/Common";
import VideoGrid from "@/components/VideoGrid";
import { getChannels, getVideos } from "@/lib/youtube";

export const metadata: Metadata = { title: "영상" };

export default function VideosPage() {
  const channels = getChannels();
  const names = channels.map((channel) => `‘${channel.name}’`).join(", ");
  return (
    <>
      <PageHero
        title="현명 영상"
        description={`유튜브 채널 ${names}의 최근 영상입니다. 썸네일을 누르면 바로 재생됩니다.`}
      />
      <section className="section">
        <div className="container">
          <VideoGrid videos={getVideos()} />
          <div className="center channel-links">
            {channels.map((channel) => (
              <a
                className="button button-outline"
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                key={channel.url}
              >
                {channels.length > 1 ? `${channel.name} 채널 바로가기 ↗` : "유튜브 채널 바로가기 ↗"}
              </a>
            ))}
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}