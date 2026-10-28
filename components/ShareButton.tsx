"use client"; // 휴대폰 공유 창과 클립보드는 브라우저에서만 쓸 수 있습니다.

import { useState } from "react";

// 공유하기 버튼. 휴대폰에서는 공유 창(카카오톡, 문자 등)이 열리고,
// 공유 창이 없는 PC에서는 링크를 복사합니다.
export default function ShareButton({ title, text, url }: { title: string; text?: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // 방문자가 공유 창을 닫은 경우 - 아무것도 하지 않습니다.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사해 주세요.", url);
    }
  }

  return (
    <button type="button" className="office-button" onClick={share}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      <span aria-live="polite">{copied ? "링크를 복사했어요" : "공유하기"}</span>
    </button>
  );
}