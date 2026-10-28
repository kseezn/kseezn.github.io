import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, PageHero } from "@/components/Common";
import { ServiceIcon } from "@/components/ServiceIcons";
import { serviceCategories, services } from "@/data/services";

export const metadata: Metadata = { title: "업무분야" };

export default function ServicesPage() {
  // 묶음 순서대로 업무를 나눕니다. (업무가 없는 묶음은 건너뜀)
  const groups = serviceCategories
    .map((category) => ({ category, list: services.filter((service) => service.category === category.id) }))
    .filter((group) => group.list.length > 0);

  return (
    <>
      <PageHero
        title="업무분야"
        description="인사노무 자문부터 노동사건, 산재·산업안전까지 노무법인의 모든 업무를 한 곳에서 수행합니다."
      />

      {/* 묶음 바로가기 */}
      <nav className="sub-tabs" aria-label="업무분야 묶음 바로가기">
        <div className="container sub-tabs-inner">
          {groups.map(({ category }) => (
            <a key={category.id} href={`#${category.id}`}>
              {category.title}
            </a>
          ))}
        </div>
      </nav>

      {groups.map(({ category, list }, index) => (
        <section
          key={category.id}
          id={category.id}
          className={index % 2 === 1 ? "section section-muted service-group" : "section service-group"}
        >
          <div className="container service-group-inner">
            <header className="service-group-head">
              <span className="eyebrow">{category.english}</span>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
            </header>
            <div className="service-tiles">
              {list.map((service) => (
                <Link className="service-tile" href={`/services/${service.slug}/`} key={service.slug}>
                  <span className="service-tile-icon">
                    <ServiceIcon slug={service.slug} size={26} />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <ul className="tags">
                    {service.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                  <span className="more">자세히 보기 →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <ContactBand />
    </>
  );
}