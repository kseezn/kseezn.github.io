"use client"; // 장면이 자동으로 넘어가고 버튼에 반응해야 해서 브라우저에서 실행됩니다.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/hero";
import { site } from "@/data/site";

const DURATION = 7000; // 한 장면을 보여 주는 시간 (밀리초)
const two = (n: number) => String(n).padStart(2, "0");

// 메인 첫 화면: 화면 전체를 채우는 사진 + 큰 제목, 장면이 차례로 넘어갑니다.
export default function HomeHero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const count = heroSlides.length;
  const slide = heroSlides[index];

  // 자동 넘김 ("애니메이션 줄이기"를 켠 방문자에게는 자동으로 넘기지 않음)
  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), DURATION);
    return () => window.clearTimeout(timer);
  }, [index, paused, count]);

  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  // 아래 화살표: 첫 화면 바로 다음 구역으로 부드럽게 내려갑니다.
  function scrollDown() {
    const height = sectionRef.current?.offsetHeight ?? window.innerHeight;
    window.scrollTo({ top: height, behavior: "smooth" });
  }

  return (
    <section className="landing" ref={sectionRef} aria-roledescription="carousel" aria-label={`${site.name} 소개`}>
      <h1 className="visually-hidden">{site.name}</h1>

      {/* 배경 사진들: 지금 장면만 보이고 천천히 확대됩니다 */}
      <div className="landing-media" aria-hidden="true">
        {heroSlides.map((item, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.image}
            src={item.image}
            alt=""
            className={i === index ? "is-active" : undefined}
            fetchPriority={i === 0 ? "high" : "low"}
          />
        ))}
      </div>
      <div className="landing-shade" aria-hidden="true" />
      {/* 세로 가는 선 (참고 사이트들의 격자 느낌) */}
      <div className="landing-lines" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="container landing-inner">
        {/* key가 바뀌면 글자가 새로 올라오는 효과가 다시 재생됩니다 */}
        <div className="landing-copy" key={index} aria-live="polite">
          <p className="landing-eyebrow">{slide.eyebrow}</p>
          <h2 className="landing-title">
            <span>{slide.title[0]}</span>
            <strong>{slide.title[1]}</strong>
          </h2>
          <p className="landing-description">{slide.description}</p>
          <div className="landing-buttons">
            <Link className="landing-button is-primary" href={slide.link.href}>
              {slide.link.label}
            </Link>
            <Link className="landing-button" href="/services/">
              업무분야 보기
            </Link>
          </div>
        </div>
      </div>

      <div className="container landing-bottom">
        {count > 1 && (
          <div className="landing-pager">
            <span className="landing-count">
              <b>{two(index + 1)}</b> / {two(count)}
            </span>
            <span className="landing-progress" aria-hidden="true">
              <i key={`${index}-${paused}`} className={paused ? "is-paused" : undefined} />
            </span>
            <button type="button" onClick={() => go(-1)} aria-label="이전 장면">
              ←
            </button>
            <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "자동 넘김 다시 시작" : "자동 넘김 멈춤"}>
              {paused ? "▶" : "❚❚"}
            </button>
            <button type="button" onClick={() => go(1)} aria-label="다음 장면">
              →
            </button>
          </div>
        )}
        <div className="landing-channels">
          {site.phone && <a href={`tel:${site.phone}`}>T. {site.phone}</a>}
          <a href={site.blog} target="_blank" rel="noopener noreferrer">
            BLOG
          </a>
          <a href={site.youtube} target="_blank" rel="noopener noreferrer">
            YOUTUBE
          </a>
          {site.kakao && (
            <a href={site.kakao} target="_blank" rel="noopener noreferrer">
              KAKAO
            </a>
          )}
        </div>
      </div>

      <button type="button" className="landing-scroll" onClick={scrollDown}>
        <span>SCROLL</span>
        <i aria-hidden="true" />
      </button>
    </section>
  );
}