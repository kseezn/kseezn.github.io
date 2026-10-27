import type { Metadata } from "next";
import { ContactBand, PageHero, ServiceCards } from "@/components/Common";

export const metadata: Metadata = { title: "업무분야" };

export default function ServicesPage() {
  return (
    <>
      <PageHero title="업무분야" description="필요한 분야의 안내를 확인해 주세요." />
      <section className="section">
        <div className="container">
          <ServiceCards />
        </div>
      </section>
      <ContactBand />
    </>
  );
}