import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactBand, PageHero, SectionHeading, ServiceCards } from "@/components/Common";
import { ServiceIcon } from "@/components/ServiceIcons";
import { serviceCategories, serviceReasons, services } from "@/data/services";

// 정적 사이트로 내보낼 때 업무분야마다 페이지를 미리 만듭니다.
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return { title: service?.title ?? "업무분야", description: service?.summary };
}

// 1 → "01"
const two = (n: number) => String(n).padStart(2, "0");

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const category = serviceCategories.find((item) => item.id === service.category);
  // 같은 묶음의 업무 (위쪽 탭)
  const siblings = services.filter((item) => item.category === service.category);
  // 관련 업무 3개: 같은 묶음을 먼저, 모자라면 다른 업무로 채움
  const related = [...siblings, ...services.filter((item) => item.category !== service.category)]
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        title={service.title}
        description={service.summary}
        parent={{ href: "/services/", label: "업무분야" }}
      />

      {/* 같은 묶음의 업무 탭 */}
      <nav className="sub-tabs" aria-label={`${category?.title ?? "업무분야"} 업무`}>
        <div className="container sub-tabs-inner">
          <Link href="/services/" className="sub-tabs-all">
            전체 업무
          </Link>
          {siblings.map((item) => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}/`}
              aria-current={item.slug === service.slug ? "page" : undefined}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      {/* 1. 소개 + 이런 경우 상담하세요 */}
      <section className="section">
        <div className="container service-intro">
          <div>
            <span className="service-intro-icon">
              <ServiceIcon slug={service.slug} size={30} />
            </span>
            <span className="eyebrow">{service.english}</span>
            <h2>{service.lead}</h2>
            <p>{service.intro}</p>
            <ul className="tags">
              {service.tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
          <aside className="service-checks">
            <h3>이런 경우 상담하세요</h3>
            <ul>
              {service.checks.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* 2. 세부 업무 */}
      <section className="section section-muted">
        <div className="container">
          <SectionHeading eyebrow="WHAT WE DO" title="세부 업무" />
          <div className="area-grid">
            {service.areas.map((area, index) => (
              <article className="area-card" key={area.title}>
                <span className="area-num">{two(index + 1)}</span>
                <h3>{area.title}</h3>
                <p>{area.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 진행 절차 */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="PROCESS" title="진행 절차" />
          <ol className="flow" style={{ "--steps": service.process.length } as CSSProperties}>
            {service.process.map((step, index) => (
              <li key={step.title}>
                <span className="flow-num">{index + 1}</span>
                <span className="step-label">STEP {two(index + 1)}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          {service.note && <p className="note">※ {service.note}</p>}
        </div>
      </section>

      {/* 4. 현명과 함께하는 이유 */}
      <section className="section section-muted">
        <div className="container">
          <SectionHeading eyebrow="WHY HYEONMYEONG" title="현명과 함께하는 이유" />
          <div className="reason-grid">
            {serviceReasons.map((reason, index) => (
              <article className="reason-card" key={reason.title}>
                <span className="reason-num">{two(index + 1)}</span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 관련 업무 */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="RELATED" title="함께 살펴보면 좋은 업무" />
          <ServiceCards list={related} />
          <div className="center">
            <Link className="more" href="/services/">
              전체 업무분야 보기 →
            </Link>
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}