import type { Metadata } from "next";
import { BlogList } from "@/components/BlogCards";
import { ContactBand, PageHero } from "@/components/Common";
import { getPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "현명 인사이트" };

export default function InsightsPage() {
  return (
    <>
      <PageHero title="현명 인사이트" description="인사노무 정보와 실무 이야기를 전합니다." />
      <section className="section">
        <div className="container">
          <BlogList posts={getPosts("insights")} />
        </div>
      </section>
      <ContactBand />
    </>
  );
}