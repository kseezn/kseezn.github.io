import ConsultForm from "@/components/ConsultForm";
import { consult } from "@/data/consult";
import { site } from "@/data/site";

// 온라인 상담 구역: 왼쪽 신청서 + 오른쪽 남색 안내 칸 (메인 화면, 상담 문의 페이지 공통)
export default function ConsultSection() {
  return (
    <section className="section consult" id="consult">
      <div className="container">
        <div className="section-heading is-center">
          <span className="eyebrow">ONLINE CONSULTATION</span>
          <h2>온라인 상담 신청</h2>
          <p>내용을 남겨 주시면 확인 후 빠르게 연락드리겠습니다.</p>
        </div>
        <div className="consult-grid">
          <ConsultForm />
          <aside className="consult-panel">
            <p className="consult-panel-title">{consult.panelTitle}</p>
            <p className="consult-panel-text">
              {consult.panelText.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <dl className="consult-panel-info">
              {site.phone && (
                <div>
                  <dt>대표전화</dt>
                  <dd>
                    <a href={`tel:${site.phone}`}>{site.phone}</a>
                  </dd>
                </div>
              )}
              {site.hours && (
                <div>
                  <dt>상담시간</dt>
                  <dd>{site.hours}</dd>
                </div>
              )}
              {site.kakao && (
                <div>
                  <dt>카카오톡</dt>
                  <dd>
                    <a href={site.kakao} target="_blank" rel="noopener noreferrer">
                      채널로 상담하기 ↗
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}