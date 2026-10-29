"use client"; // 화면에 들어오는 순간을 알아내야 해서 브라우저에서 실행됩니다.

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 스크롤해서 화면에 들어올 때 살짝 떠오르며 나타날 부분들
const SELECTOR = [
  "main .section-heading",
  ".strengths-grid > *",
  ".core-grid > *",
  ".service-grid > *",
  ".member-cards > li",
  ".blog-grid > *",
  ".video-grid > *",
  ".news-columns > *",
  ".faq",
  ".logo-rows",
  ".awards-track",
  ".service-tiles > *",
  ".service-intro > *",
  ".area-grid > *",
  ".flow > li",
  ".reason-grid > *",
  ".member-profile",
  ".staff-cards > li",
  ".office-panel",
  ".consult-grid > *",
  ".contact-band .container",
].join(", ");

// 화면에 아무것도 그리지 않고, 페이지가 바뀔 때마다 위 부분들에 효과만 붙입니다.
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // "애니메이션 줄이기"를 켠 방문자나 오래된 브라우저에서는 효과 없이 그대로 보여 줍니다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((element) => {
      // 이미 나타난 것은 건너뜁니다. (개발 모드에서 이 코드가 두 번 실행돼도 아직 안 나타난 것은 다시 지켜봄)
      if (element.classList.contains("is-revealed")) return;
      // 같은 줄에 나란히 있는 카드는 차례로 조금씩 늦게 나타납니다.
      const order = element.parentElement ? Array.from(element.parentElement.children).indexOf(element) : 0;
      element.style.setProperty("--reveal-delay", `${Math.min(Math.max(order, 0), 5) * 80}ms`);
      element.classList.add("reveal");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}