"use client"; // 썸네일을 누르면 그 자리에서 재생해야 해서 브라우저에서 실행됩니다.

import { useState } from "react";
import type { Video } from "@/lib/youtube";
import { formatDate } from "@/lib/format";

// 처음에는 썸네일만 보여 주고, 누르면 그 자리에 유튜브 플레이어를 띄웁니다.
// (영상마다 플레이어를 미리 띄우면 페이지가 무거워지기 때문입니다.)
function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="video-card">
      <div className="video-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" className="video-poster" onClick={() => setPlaying(true)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.thumbnail} alt="" loading="lazy" width="480" height="360" />
            <span className="play-button" aria-hidden="true" />
            <span className="visually-hidden">재생: {video.title}</span>
          </button>
        )}
      </div>
      <div className="video-body">
        <h3>{video.title}</h3>
        <div className="video-meta">
          <time dateTime={video.published}>{formatDate(video.published)}</time>
          <a href={video.url} target="_blank" rel="noopener noreferrer">
            유튜브에서 보기 ↗
          </a>
        </div>
      </div>
    </article>
  );
}

export default function VideoGrid({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return <p className="empty">아직 불러온 영상이 없습니다. 유튜브 채널에서 최근 영상을 확인해 주세요.</p>;
  }
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard video={video} key={video.id} />
      ))}
    </div>
  );
}