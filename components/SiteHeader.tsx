"use client"; // 메뉴 열기/닫기처럼 클릭에 반응해야 해서 브라우저에서 실행되는 컴포넌트입니다.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import LogoMark from "@/components/LogoMark";
import { services, site } from "@/data/site";

type SubItem = { label: string; href: string; external?: boolean };
type MenuItem = { label: string; href: string; children?: SubItem[] };

const menu: MenuItem[] = [
  {
    label: "업무분야",
    href: "/services/",
    children: [
      { label: "업무분야 전체", href: "/services/" },
      ...services.map((service) => ({
        label: service.title,
        href: `/services/${service.slug}/`,
      })),
    ],
  },
  { label: "구성원", href: "/members/" },
  {
    label: "인사이트",
    href: "/insights/",
    children: [
      { label: "인사이트 전체", href: "/insights/" },
      { label: "공식 블로그 ↗", href: site.blog, external: true },
    ],
  },
  {
    label: "법인 소식",
    href: "/news/",
    children: [
      { label: "소식 전체", href: "/news/" },
      { label: "언론 보도", href: "/press/" },
    ],
  },
  { label: "영상", href: "/videos/" },
  { label: "HR뉴스", href: "/hrnews/" },
  { label: "자주 묻는 질문", href: "/faq/" },
  { label: "오시는 길", href: "/location/" },
];

// 페이지를 조금이라도 내렸는지 (브라우저의 스크롤 위치를 지켜봅니다)
function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
const getScrolled = () => window.scrollY > 40;
const getScrolledOnServer = () => false;

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false); // 휴대폰 메뉴 열림 여부
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // 열린 드롭다운 이름
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const current = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getScrolledOnServer);
  // 메인 화면 맨 위에서는 메뉴바를 투명하게 (사진 위에 흰 글자). 내리거나 휴대폰 메뉴를 열면 흰 배경으로 바뀝니다.
  const isHome = current === "/";
  const overlay = isHome && !scrolled && !mobileOpen;

  // 메뉴 바깥을 클릭하면 드롭다운을 닫습니다.
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeAll = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* 맨 위 얇은 안내 줄: 운영시간·전화번호가 없으면 블로그 링크를 보여 줍니다. (메인 화면에서는 숨김) */}
      {!isHome && (
        <div className="topbar">
          <div className="container topbar-inner">
            {site.hours && <span>{site.hours}</span>}
            {site.phone && (
              <span>
                대표전화 <a href={`tel:${site.phone}`}>{site.phone}</a>
              </span>
            )}
            {site.fax && <span>팩스 {site.fax}</span>}
            {!site.hours && !site.phone && (
              <a href={site.blog} target="_blank" rel="noopener noreferrer">
                노무법인 현명 공식 블로그 ↗
              </a>
            )}
          </div>
        </div>
      )}

      <header
        className={["site-header", isHome && "is-home", overlay && "is-overlay"].filter(Boolean).join(" ")}
        ref={headerRef}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeAll();
        }}
      >
        <div className="container header-inner">
          <Link href="/" className="brand" onClick={closeAll} aria-label={`${site.name} 홈`}>
            <LogoMark size={38} />
            <span className="brand-text">
              <b>{site.name}</b>
              <small>{site.englishName}</small>
            </span>
          </Link>

          <button
            type="button"
            className="menu-button"
            aria-expanded={mobileOpen}
            aria-controls="site-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "닫기 ✕" : "메뉴 ☰"}
          </button>

          <nav id="site-menu" className={mobileOpen ? "site-nav is-open" : "site-nav"} aria-label="주 메뉴">
            <ul className="nav-list">
              {menu.map((item) => {
                const active = current.startsWith(item.href);
                if (!item.children) {
                  return (
                    <li key={item.label}>
                      <Link
                        className="nav-link"
                        href={item.href}
                        onClick={closeAll}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const open = openDropdown === item.label;
                return (
                  <li key={item.label} className="has-dropdown">
                    <button
                      type="button"
                      className={active ? "nav-link is-active" : "nav-link"}
                      aria-expanded={open}
                      onClick={() => setOpenDropdown(open ? null : item.label)}
                    >
                      {item.label}
                      <span className="caret" aria-hidden="true" />
                    </button>
                    {open && (
                      <div className={item.children.length > 4 ? "dropdown dropdown-wide" : "dropdown"}>
                        {item.children.map((child) =>
                          child.external ? (
                            <a
                              key={child.href}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeAll}
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link key={child.href} href={child.href} onClick={closeAll}>
                              {child.label}
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link className="nav-cta" href="/contact/" onClick={closeAll}>
              상담 문의
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}