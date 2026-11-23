"use client"; // 썸네일을 누르면 화면 가운데 큰 창에서 재생해야 해서 브라우저에서 실행됩니다.

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/youtube";
import { formatDate } from "@/lib/format";

// 목록에는 썸네일만 보여 주고, 누르면 화면 가운데 큰 창에서 재생합니다.
// (영상마다 플레이어를 미리 띄우면 페이지가 무거워지기 때문입니다.)
function VideoCard({ video, onPlay }: { video: Video; onPlay: (video: Video) => void }) {
  return (
    <article className="video-card">
      <div className="video-frame">
        <button type="button" className="video-poster" onClick={() => onPlay(video)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={video.thumbnail} alt="" loading="lazy" width="480" height="360" />
          <span className="play-button" aria-hidden="true" />
          <span className="visually-hidden">재생: {video.title}</span>
        </button>
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [current, setCurrent] = useState<Video | null>(null); // 지금 재생 중인 영상

  // 재생 창 열고 닫기 (닫으면 플레이어가 사라지면서 소리도 멈춥니다)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current && !dialog.open) {
      dialog.showModal();
      // 처음 초점을 ✕ 버튼에 둡니다. (플레이어 안에 초점이 가면 Esc 키로 창이 닫히지 않아서)
      closeRef.current?.focus();
    }
    if (!current && dialog.open) dialog.close();
  }, [current]);

  if (videos.length === 0) {
    return <p className="empty">아직 불러온 영상이 없습니다. 유튜브 채널에서 최근 영상을 확인해 주세요.</p>;
  }

  return (
    <>
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard video={video} onPlay={setCurrent} key={video.id} />
        ))}
      </div>

      {/* 재생 창 (Esc 키, ✕ 버튼, 영상 바깥 어두운 곳을 누르면 닫힘) */}
      <dialog
        ref={dialogRef}
        className="video-viewer"
        aria-label={current ? `영상 재생: ${current.title}` : "영상 재생"}
        onClose={() => setCurrent(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setCurrent(null);
        }}
      >
        {current && (
          <div className="video-viewer-box">
            <div className="video-viewer-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0`}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="video-viewer-caption">
              <strong>{current.title}</strong>
              <a href={current.url} target="_blank" rel="noopener noreferrer">
                유튜브에서 보기 ↗
              </a>
            </div>
          </div>
        )}
        <button ref={closeRef} type="button" className="video-viewer-close" onClick={() => setCurrent(null)} aria-label="닫기">
          ✕
        </button>
      </dialog>
    </>
  );
}