import type { Metadata } from "next";
import { ContactBand, PageHero } from "@/components/Common";

export const metadata: Metadata = { title: "언론 보도" };

export default function PressPage() {
  return (
    <>
      <PageHero
        title="언론 보도"
        description="현명 관련 언론 보도를 안내합니다."
        parent={{ href: "/news/", label: "법인 소식" }}
      />
      <section className="section">
        <div className="container">
          <p className="empty">등록된 언론 보도가 없습니다.</p>
        </div>
      </section>
      <ContactBand />
    </>
  );
}