import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Common";
import ConsultSection from "@/components/ConsultSection";
import { naverMapLink, offices, site } from "@/data/site";

export const metadata: Metadata = { title: "상담 문의" };

export default function ContactPage() {
  return (
    <>
      <PageHero title="상담 문의" description="가까운 사무실로 전화하시거나 아래 채널로 문의해 주세요." />
      <ConsultSection />
      <section className="section">
        <div className="container contact-grid">
          <article className="info-card">
            <h2>연락처 안내</h2>
            <dl className="info-list">
              {offices.map((office) => (
                <div key={office.id}>
                  <dt>{office.name}</dt>
                  <dd>
                    <a href={`tel:${office.phone}`}>{office.phone}</a>
                    <br />
                    <span className="info-sub">{office.address}</span>{" "}
                    <a className="info-map" href={naverMapLink(office)} target="_blank" rel="noopener noreferrer">
                      지도 ↗
                    </a>
                  </dd>
                </div>
              ))}
              {site.email && (
                <div>
                  <dt>이메일</dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
              )}
              {site.hours && (
                <div>
                  <dt>상담시간</dt>
                  <dd>{site.hours}</dd>
                </div>
              )}
            </dl>
            <div className="button-row">
              <Link className="button button-navy" href="/location/">
                오시는 길
              </Link>
              <a className="button button-outline" href={site.blog} target="_blank" rel="noopener noreferrer">
                공식 블로그 ↗
              </a>
              {site.kakao && (
                <a className="button button-outline" href={site.kakao} target="_blank" rel="noopener noreferrer">
                  카카오톡 상담 ↗
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