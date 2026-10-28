import type { Metadata } from "next";
import { ContactBand, PageHero } from "@/components/Common";
import NaverMap from "@/components/NaverMap";
import ShareButton from "@/components/ShareButton";
import { naverMapLink, offices } from "@/data/site";

export const metadata: Metadata = { title: "오시는 길" };

export default function LocationPage() {
  return (
    <>
      <PageHero title="오시는 길" description="천안 본사와 아산·서울 지사의 위치를 안내합니다." />

      {/* 사무실 바로가기 */}
      <nav className="sub-tabs" aria-label="사무실 바로가기">
        <div className="container sub-tabs-inner">
          {offices.map((office) => (
            <a key={office.id} href={`#${office.id}`}>
              {office.name}
            </a>
          ))}
        </div>
      </nav>

      {/* 사무실마다 제목 → 지도 → 남색 안내칸 (지도와 같은 폭) */}
      {offices.map((office, index) => {
        const link = naverMapLink(office);
        return (
          <section
            key={office.id}
            id={office.id}
            className={index % 2 === 1 ? "section section-muted office-section" : "section office-section"}
          >
            <div className="container">
              <header className="office-head">
                <span className="eyebrow">{office.id.toUpperCase()} OFFICE</span>
                <h2>{office.name}</h2>
              </header>

              <div className="office-panel">
                <NaverMap office={office} />
                <div className="office-panel-info">
                  <p className="office-panel-address">{office.address}</p>
                  <p className="office-panel-detail">{office.detail}</p>
                  <p className="office-panel-contact">
                    <span>
                      <b>TEL</b> <a href={`tel:${office.phone}`}>{office.phone}</a>
                    </span>
                    {office.fax && (
                      <span>
                        <b>FAX</b> {office.fax}
                      </span>
                    )}
                  </p>
                  <div className="office-panel-buttons">
                    <ShareButton
                      title={`노무법인 현명 ${office.name}`}
                      text={`${office.address} ${office.detail}`}
                      url={link}
                    />
                    <a className="office-button" href={link} target="_blank" rel="noopener noreferrer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                        <circle cx="12" cy="9.5" r="2.5" />
                      </svg>
                      <span>네이버 지도에서 보기</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <ContactBand />
    </>
  );
}