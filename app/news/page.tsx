import type { Metadata } from "next";
import { BlogList } from "@/components/BlogCards";
import { ContactBand, PageHero } from "@/components/Common";
import { getPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "법인 소식" };

export default function NewsPage() {
  return (
    <>
      <PageHero title="법인 소식" description="현명 블로그에서 전하는 활동과 소식입니다." />
      <section className="section">
        <div className="container">
          <BlogList posts={getPosts("news")} />
        </div>
      </section>
      <ContactBand />
    </>
  );
}