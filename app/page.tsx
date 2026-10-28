import Link from "next/link";
import { BlogCards } from "@/components/BlogCards";
import ClientsAwards from "@/components/ClientsAwards";
import {
  ContactBand,
  FaqList,
  NewsRows,
  SectionHeading,
  ServiceCards,
  ServiceIcon,
} from "@/components/Common";
import HomeHero from "@/components/HomeHero";
import { MemberCards } from "@/components/Members";
import VideoGrid from "@/components/VideoGrid";
import { members } from "@/data/members";
import { coreSlugs, services, strengths } from "@/data/site";
import { getPosts } from "@/lib/blog";
import { getVideos } from "@/lib/youtube";

export default function HomePage() {
  // coreSlugs에 적은 순서대로 핵심 업무 3개를 꺼냅니다.
  const coreServices = coreSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service) => service !== undefined);

  return (
    <>
      {/* 1. 첫 화면: 화면 전체 사진 + 큰 제목 (components/HomeHero.tsx, data/hero.ts) */}
      <HomeHero />

      {/* 2. 흰색 4칸 키워드 */}
      <section className="strengths" aria-label="주요 업무 키워드">
        <div className="container strengths-grid">
          {strengths.map((item) => (
            <div key={item.value}>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 핵심 업무 카드 3개 */}
      <section className="section section-muted">
        <div className="container">
          <SectionHeading eyebrow="CORE PRACTICE" title="주요 업무를 소개합니다" />
          <div className="core-grid">
            {coreServices.map((service) => (
              <Link className="core-card" href={`/services/${service.slug}/`} key={service.slug}>
                <div className="core-top">
                  <span className="core-icon">
                    <ServiceIcon slug={service.slug} />
                  </span>
                  <span className="core-label">{service.title}</span>
                </div>
                <h3>{service.lead}</h3>
                <p>{service.summary}</p>
                <ul className="tags">
                  {service.tasks.slice(0, 2).map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
                <span className="more">자세히 보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 전체 업무분야 10개 */}
      <section className="section" id="work">
        <div className="container">
          <SectionHeading
            eyebrow="PRACTICE AREAS"
            title="업무분야"
            description="필요한 분야를 선택해 자세한 내용을 확인하세요."
            align="center"
          />
          <ServiceCards />
        </div>
      </section>

      {/* 5. 구성원 소개 (data/members.ts) */}
      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="MEMBERS"
            title="함께하는 노무법인 현명"
            description="현명한 노무 전문팀과 신뢰할 수 있는 전문가 협업 시스템으로 함께합니다."
            align="center"
          />
          <MemberCards members={members} />
          <div className="center">
            <Link className="more" href="/members/">
              구성원 전체 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 5-1. 고객사 로고 · 수상 및 위촉 (data/clients.ts) */}
      <ClientsAwards />

      {/* 6. 인사이트 최신 글 3개 */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="INSIGHTS"
            title="현명 인사이트"
            description="공식 블로그에서 전하는 인사노무 이야기"
            align="center"
          />
          <BlogCards posts={getPosts("insights", 3)} images={false} />
          <div className="center">
            <Link className="more" href="/insights/">
              인사이트 전체 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. 유튜브 최근 영상 3개 */}
      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="VIDEOS"
            title="현명 영상"
            description="유튜브 채널 ‘현명한 노무사’의 최근 영상입니다. 썸네일을 누르면 바로 재생됩니다."
            align="center"
          />
          <VideoGrid videos={getVideos(3)} />
          <div className="center">
            <Link className="more" href="/videos/">
              영상 전체 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. 법인 소식 · HR뉴스 */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="NEWS"
            title="소식"
            description="현명의 이야기와 인사노무 관련 소식을 전합니다."
            align="center"
          />
          <div className="news-columns">
            <div>
              <h3 className="news-title">
                법인 소식
                <Link href="/news/">전체 보기 →</Link>
              </h3>
              <NewsRows posts={getPosts("news", 4)} />
            </div>
            <div>
              <h3 className="news-title">
                HR뉴스
                <Link href="/hrnews/">전체 보기 →</Link>
              </h3>
              <NewsRows posts={getPosts("hrnews", 4)} />
            </div>
          </div>
        </div>
      </section>

      {/* 9. 자주 묻는 질문 */}
      <section className="section section-muted" id="faq">
        <div className="container">
          <SectionHeading eyebrow="FAQ" title="자주 묻는 질문" align="center" />
          <FaqList />
        </div>
      </section>

      {/* 10. 상담 안내 */}
      <ContactBand />
    </>
  );
}