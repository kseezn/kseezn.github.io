import type { Metadata } from "next";
import { ContactBand, PageHero } from "@/components/Common";
import { formatDate } from "@/lib/format";
import { getPressArticles } from "@/lib/press";

export const metadata: Metadata = { title: "언론 보도" };

export default function PressPage() {
  const articles = getPressArticles();
  return (
    <>
      <PageHero
        title="언론 보도"
        description="현명 관련 언론 보도를 안내합니다."
        parent={{ href: "/news/", label: "법인 소식" }}
      />
      <section className="section">
        <div className="container">
          {articles.length === 0 ? (
            <p className="empty">등록된 언론 보도가 없습니다.</p>
          ) : (
            <div className="news-list press-list">
              {articles.map((article) => (
                <a href={article.url} key={article.id} target="_blank" rel="noopener noreferrer">
                  <span className="tag">{article.source || "언론 보도"}</span>
                  <strong>{article.title}</strong>
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                </a>
              ))}
            </div>
          )}
          <p className="press-note">기사 제목을 누르면 해당 언론사 페이지로 이동합니다.</p>
        </div>
      </section>
      <ContactBand />
    </>
  );
}