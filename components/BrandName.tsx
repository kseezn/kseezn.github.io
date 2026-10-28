"use client"; // 글자 폭을 재서 맞춰야 해서 브라우저에서 실행됩니다.

import { useEffect, useRef } from "react";
import { site } from "@/data/site";

const MIN_GAP = 1.2; // 영문 글자 사이 최소 간격(px). 이보다 좁아져야 하면 글자 크기를 줄여서 맞춥니다.

// 로고 옆 법인명 두 줄: "노무법인 현명" + "WISE LABOR LAW FIRM"
// 영문 줄의 글자 간격을 자동으로 조절해서, 영문 전체 길이를 한글 이름 길이와 똑같이 맞춥니다.
// (글꼴이 늦게 불러와지거나 화면 크기가 바뀌어도 다시 맞춤)
export default function BrandName() {
  const nameRef = useRef<HTMLElement>(null);
  const subRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const name = nameRef.current;
    const sub = subRef.current;
    if (!name || !sub) return;

    function fit() {
      if (!name || !sub) return;
      // 처음 상태(CSS에 적은 크기, 간격 없음)로 되돌린 뒤 길이를 잽니다.
      sub.style.fontSize = "";
      sub.style.letterSpacing = "0px";
      sub.style.marginRight = "0px";
      const target = name.getBoundingClientRect().width; // 한글 이름 길이
      let natural = sub.getBoundingClientRect().width; // 간격 없이 쓴 영문 길이
      const gaps = (sub.textContent ?? "").length - 1;
      if (!target || !natural || gaps < 1) return;

      // 간격이 너무 좁아질 만큼 영문이 길면, 글자 크기를 줄여서 최소 간격을 지킵니다.
      if ((target - natural) / gaps < MIN_GAP) {
        const size = parseFloat(getComputedStyle(sub).fontSize);
        sub.style.fontSize = `${(size * (target - MIN_GAP * gaps)) / natural}px`;
        natural = sub.getBoundingClientRect().width;
      }

      const spacing = (target - natural) / gaps;
      sub.style.letterSpacing = `${spacing}px`;
      sub.style.marginRight = `${-spacing}px`; // 마지막 글자 뒤에 붙는 간격은 빼 줌
    }

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(name); // 한글 글자 크기가 바뀌면 다시 맞춤
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener("loadingdone", fit); // 영문 글꼴이 늦게 도착하면 다시 맞춤
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, []);

  return (
    <span className="brand-text">
      <b ref={nameRef}>{site.name}</b>
      <small ref={subRef}>{site.englishName}</small>
    </span>
  );
}