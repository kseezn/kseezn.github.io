// 여러 페이지에서 함께 쓰는 화면 조각들입니다.
import Link from "next/link";
import BrandName from "@/components/BrandName";
import LogoMark from "@/components/LogoMark";
import { faqs, offices, services, site, type Service } from "@/data/site";
import type { BlogPost } from "@/lib/blog";
import { sectionLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";

// 구역 제목: 작은 영문 표시 + 큰 제목 + 설명
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "section-heading is-center" : "section-heading"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

// 하위 페이지 맨 위 남색 제목 영역
export function PageHero({
  title,
  description,
  parent,
}: {
  title: string;
  description?: string;
  parent?: { href: string; label: string };
}) {
  return (
    <section className="page-hero">
      <LogoMark className="page-hero-mark" size={320} />
      <div className="container">
        <p className="breadcrumb">
          <Link href="/">홈</Link>
          {parent && (
            <>
              <span aria-hidden="true"> / </span>
              <Link href={parent.href}>{parent.label}</Link>
            </>
          )}
          <span aria-hidden="true"> / </span>
          {title}
        </p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}

// 업무 카드 10개 (메인, 업무분야 페이지 공통)
export function ServiceCards({ list = services }: { list?: Service[] }) {
  return (
    <div className="service-grid">
      {list.map((service) => (
        <Link className="service-card" href={`/services/${service.slug}/`} key={service.slug}>
          <h3>
            {service.title}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </h3>
          <p>{service.summary}</p>
        </Link>
      ))}
    </div>
  );
}

// 업무 아이콘은 components/ServiceIcons.tsx에 있습니다. (메인 화면이 여기서 불러올 수 있게 연결만 해 둠)
export { ServiceIcon } from "@/components/ServiceIcons";

// 분류 표시 + 제목 + 날짜만 있는 짧은 글 목록 (메인의 법인 소식, HR뉴스)
export function NewsRows({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="empty">등록된 소식이 없습니다.</p>;
  }
  return (
    <div className="news-list">
      {posts.map((post) => (
        <a href={post.url} key={post.id} target="_blank" rel="noopener noreferrer">
          <span className="tag">{sectionLabels[post.section]}</span>
          <strong>{post.displayTitle}</strong>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </a>
      ))}
    </div>
  );
}

// 자주 묻는 질문 (첫 번째 질문은 펼친 상태)
export function FaqList() {
  return (
    <div className="faq">
      {faqs.map((faq, index) => (
        <details key={faq.q} open={index === 0}>
          <summary>
            <span className="faq-q" aria-hidden="true">
              Q
            </span>
            {faq.q}
          </summary>
          <p>{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

// 페이지 아래쪽 남색 상담 안내
export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="container">
        <h2>
          일터의 고민,
          <br />
          현명과 함께 이야기해 보세요.
        </h2>
        <p>문의하실 내용을 알려주시면 필요한 절차를 함께 살펴봅니다.</p>
        <div className="button-row is-center">
          {site.phone && (
            <a className="button button-light" href={`tel:${site.phone}`}>
              전화 상담 {site.phone}
            </a>
          )}
          {site.kakao && (
            <a className="button button-light" href={site.kakao} target="_blank" rel="noopener noreferrer">
              카카오톡 상담
            </a>
          )}
          <Link className="button button-light" href="/contact/">
            상담 안내
          </Link>
          <a className="button button-ghost" href={site.blog} target="_blank" rel="noopener noreferrer">
            공식 블로그 ↗
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
            <Link className="footer-brand" href="/">
            <LogoMark size={48} />
            <BrandName />
          </Link>
          <p>
            {site.representative && <>대표 {site.representative}</>}
            {site.representative && site.businessNumber && " · "}
            {site.businessNumber && <>사업자등록번호 {site.businessNumber}</>}
          </p>
          <p className="footer-links">
            <a href={site.blog} target="_blank" rel="noopener noreferrer">
              네이버 블로그 ↗
            </a>
            <a href={site.youtube} target="_blank" rel="noopener noreferrer">
              유튜브 ↗
            </a>
          </p>
        </div>
        <div className="footer-offices">
          {offices.map((office) => (
            <p key={office.id}>
              <b>
                {office.name} {office.phone}
              </b>
              <br />
              {office.address} {office.detail}
            </p>
          ))}
          <p className="copyright">© {site.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}