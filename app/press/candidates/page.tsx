import type { Metadata } from "next";
import { PageHero } from "@/components/Common";
import { formatDate } from "@/lib/format";
import { getPressCandidates } from "@/lib/press";

// 관리용 페이지: 노무사 이름으로 찾은 '후보' 기사를 확인합니다. (메뉴에 없고, 검색엔진에도 나오지 않음)
export const metadata: Metadata = { title: "언론 보도 후보", robots: { index: false, follow: false } };

export default function PressCandidatesPage() {
  const candidates = getPressCandidates();
  return (
    <>
      <PageHero title="언론 보도 후보" description="노무사 이름으로 찾은 기사입니다. 확인 후 게시할 기사만 골라 주세요." />
      <section className="section">
        <div className="container press-candidates">
          <ol className="press-howto">
            <li>아래 기사 제목을 눌러 우리 노무사 관련 기사가 맞는지 확인합니다.</li>
            <li>
              게시할 기사의 번호를 <code>data/press-overrides.json</code>의 <code>&quot;show&quot;</code> 안에
              넣습니다. 예: <code>&quot;show&quot;: [&quot;1a2b3c4d5e6f&quot;]</code>
            </li>
            <li>관계없는 기사는 번호를 <code>&quot;hide&quot;</code>에 넣으면 이 목록에서도 사라집니다.</li>
          </ol>
          {candidates.length === 0 ? (
            <p className="empty">확인할 후보 기사가 없습니다.</p>
          ) : (
            <ul className="press-candidate-list">
              {candidates.map((article) => (
                <li key={article.id}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                  <span>
                    {article.source} · {formatDate(article.date)} · 찾은 이름: {article.matched?.join(", ")}
                  </span>
                  <code>&quot;{article.id}&quot;</code>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}