"use client"; // 좌우 버튼과 크게 보기 창이 브라우저에서 움직여야 해서 브라우저에서 실행됩니다.

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Award } from "@/data/clients";

// 수상·위촉장: 옆으로 넘기는 목록 + 누르면 크게 보기
export default function AwardGallery({ awards, children }: { awards: Award[]; children: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null); // 크게 보고 있는 사진 번호

  // 좌우 버튼: 보이는 폭의 80%만큼 넘깁니다.
  function slide(direction: 1 | -1) {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  }

  // 크게 보기 창 열고 닫기
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current !== null && !dialog.open) dialog.showModal();
    if (current === null && dialog.open) dialog.close();
  }, [current]);

  const move = (step: number) =>
    setCurrent((index) => (index === null ? null : (index + step + awards.length) % awards.length));

  const label = (award: Award, index: number) => award.title || `수상 및 위촉 ${index + 1}`;
  const shown = current === null ? null : awards[current];

  return (
    <div className="awards">
      <div className="awards-head">
        {children}
        <div className="awards-nav">
          <button type="button" onClick={() => slide(-1)} aria-label="이전 사진들">
            ←
          </button>
          <button type="button" onClick={() => slide(1)} aria-label="다음 사진들">
            →
          </button>
        </div>
      </div>

      <ul className="awards-track" ref={trackRef}>
        {awards.map((award, index) => (
          <li key={award.image}>
            <button type="button" className="award-card" onClick={() => setCurrent(index)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={award.image} alt={label(award, index)} width={660} height={934} loading="lazy" />
              {award.title && <span className="award-title">{award.title}</span>}
            </button>
          </li>
        ))}
      </ul>

      {/* 크게 보기 창 (Esc 키나 바깥을 누르면 닫힘, ← → 키로 넘기기) */}
      <dialog
        ref={dialogRef}
        className="award-viewer"
        aria-label="수상 및 위촉 크게 보기"
        onClose={() => setCurrent(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setCurrent(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
      >
        {shown && current !== null && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shown.image} alt={label(shown, current)} />
            <figcaption>
              {shown.title && <strong>{shown.title}</strong>}
              <span>
                {current + 1} / {awards.length}
              </span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="award-viewer-close" onClick={() => setCurrent(null)} aria-label="닫기">
          ✕
        </button>
        <button type="button" className="award-viewer-prev" onClick={() => move(-1)} aria-label="이전 사진">
          ←
        </button>
        <button type="button" className="award-viewer-next" onClick={() => move(1)} aria-label="다음 사진">
          →
        </button>
      </dialog>
    </div>
  );
}