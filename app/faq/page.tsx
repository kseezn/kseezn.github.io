import type { Metadata } from "next";
import { ContactBand, FaqList, PageHero } from "@/components/Common";

export const metadata: Metadata = { title: "자주 묻는 질문" };

export default function FaqPage() {
  return (
    <>
      <PageHero title="자주 묻는 질문" description="상담 전에 궁금한 사항을 확인해 보세요." />
      <section className="section">
        <div className="container">
          <FaqList />
        </div>
      </section>
      <ContactBand />
    </>
  );
}