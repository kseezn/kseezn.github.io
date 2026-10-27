import type { Metadata } from "next";
import { ContactBand, PageHero } from "@/components/Common";
import VideoGrid from "@/components/VideoGrid";
import { site } from "@/data/site";
import { getVideos } from "@/lib/youtube";

export const metadata: Metadata = { title: "영상" };

export default function VideosPage() {
  return (
    <>
      <PageHero title="현명 영상" description="유튜브 채널 ‘현명한 노무사’의 최근 영상입니다. 썸네일을 누르면 바로 재생됩니다." />
      <section className="section">
        <div className="container">
          <VideoGrid videos={getVideos()} />
          <div className="center">
            <a className="button button-outline" href={site.youtube} target="_blank" rel="noopener noreferrer">
              유튜브 채널 바로가기 ↗
            </a>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}