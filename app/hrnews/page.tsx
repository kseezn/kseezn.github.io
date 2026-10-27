import type { Metadata } from "next";
import { BlogList } from "@/components/BlogCards";
import { ContactBand, PageHero } from "@/components/Common";
import { getPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "HR뉴스" };

export default function HrNewsPage() {
  return (
    <>
      <PageHero title="HR뉴스" description="블로그에 게시된 인사노무 관련 소식을 모았습니다." />
      <section className="section">
        <div className="container">
          <BlogList posts={getPosts("hrnews")} />
        </div>
      </section>
      <ContactBand />
    </>
  );
}