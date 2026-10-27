import type { Metadata } from "next";
import { ContactBand, PageHero } from "@/components/Common";
import NaverMap from "@/components/NaverMap";
import { offices } from "@/data/site";

export const metadata: Metadata = { title: "오시는 길" };

export default function LocationPage() {
  return (
    <>
      <PageHero title="오시는 길" description="천안 본사와 아산·서울 지사의 위치를 안내합니다." />
      <section className="section">
        <div className="container office-grid">
          {offices.map((office) => (
            <article className="office-card" id={office.id} key={office.id}>
              <h2 className="office-name">{office.name}</h2>
              <NaverMap office={office} />
              <div className="office-info">
                <p className="office-address">
                  {office.address}
                  <br />
                  {office.detail}
                </p>
                <p className="office-phone">
                  <a href={`tel:${office.phone}`}>{office.phone}</a>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ContactBand />
    </>
  );
}