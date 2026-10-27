import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactBand, PageHero, SectionHeading } from "@/components/Common";
import { processSteps, services } from "@/data/site";

// 정적 사이트로 내보낼 때 업무분야마다 페이지를 미리 만듭니다.
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: services.find((service) => service.slug === slug)?.title ?? "업무분야" };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        title={service.title}
        description={service.summary}
        parent={{ href: "/services/", label: "업무분야" }}
      />

      {/* 이런 일을 합니다 */}
      <section className="section section-muted">
        <div className="container">
          <SectionHeading eyebrow="HOW WE HELP" title={service.lead} />
          <div className="task-grid">
            {service.tasks.map((task) => (
              <article className="info-card" key={task}>
                <span className="check" aria-hidden="true" />
                <h3>{task}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 진행 절차 */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="PROCESS" title="진행 절차" />
          <ol className="process-grid">
            {processSteps.map((step, index) => (
              <li className="info-card" key={step}>
                <span className="step-label">STEP {String(index + 1).padStart(2, "0")}</span>
                <h3>{step}</h3>
              </li>
            ))}
          </ol>
          <p className="note">구체적인 진행 방식은 의뢰 내용과 협의 범위에 따라 달라질 수 있습니다.</p>
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