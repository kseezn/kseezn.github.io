import type { Metadata } from "next";
import { PageHero } from "@/components/Common";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "상담 문의" };

export default function ContactPage() {
  // data/site.ts에 값이 있는 항목만 보여 줍니다.
  const contacts = [
    { label: "대표전화", value: site.phone, href: `tel:${site.phone}` },
    { label: "이메일", value: site.email, href: `mailto:${site.email}` },
    { label: "상담시간", value: site.hours },
    { label: "주소", value: site.address },
  ].filter((item) => item.value);

  return (
    <>
      <PageHero title="상담 문의" description="상담 채널과 연락처를 안내합니다." />
      <section className="section">
        <div className="container contact-grid">
          <article className="info-card">
            <h2>연락처 안내</h2>
            {contacts.length > 0 ? (
              <dl className="info-list">
                {contacts.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>연락처 안내를 준비하고 있습니다. 공식 블로그를 확인해 주세요.</p>
            )}
            <div className="button-row">
              <a className="button button-navy" href={site.blog} target="_blank" rel="noopener noreferrer">
                공식 블로그 ↗
              </a>
              {site.kakao && (
                <a className="button button-outline" href={site.kakao} target="_blank" rel="noopener noreferrer">
                  카카오톡 상담 ↗
                </a>
              )}
              {site.mapUrl && (
                <a className="button button-outline" href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                  오시는 길 ↗
                </a>
              )}
            </div>
          </article>

          <article className="info-card">
            <h2>상담 전 준비사항</h2>
            <ol className="prep-list">
              <li>문의 주제와 현재 상황을 간단히 정리해 주세요.</li>
              <li>진행 중인 절차와 관련 일정을 확인해 주세요.</li>
              <li>관련 자료가 있다면 상담 시 함께 확인할 수 있도록 준비해 주세요.</li>
            </ol>
          </article>
        </div>
      </section>
    </>
  );
}