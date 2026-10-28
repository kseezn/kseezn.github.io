import AwardGallery from "@/components/AwardGallery";
import { awards, clients, clientsDescription, clientsSummary, type Client } from "@/data/clients";

// 로고가 끊김 없이 옆으로 흘러가는 줄. 같은 목록을 두 번 이어 붙여 한 바퀴 돌면 처음과 똑같아 보이게 합니다.
function LogoRow({ list, reverse = false }: { list: Client[]; reverse?: boolean }) {
  return (
    <div className={reverse ? "logo-marquee is-reverse" : "logo-marquee"}>
      <ul className="logo-track">
        {[...list, ...list].map((client, index) => (
          <li key={`${client.logo}-${index}`} aria-hidden={index >= list.length ? true : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={client.logo} alt={index >= list.length ? "" : client.name} decoding="async" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// 메인 화면: 고객사 로고 + 수상 및 위촉 (남색 배경)
export default function ClientsAwards() {
  const half = Math.ceil(clients.length / 2);

  return (
    <section className="section trust-band">
      <div className="container">
        <div className="section-heading is-center">
          <span className="eyebrow">CLIENTS</span>
          <h2>{clientsSummary}</h2>
          <p>{clientsDescription}</p>
        </div>
      </div>

      <div className="logo-rows">
        <LogoRow list={clients.slice(0, half)} />
        <LogoRow list={clients.slice(half)} reverse />
      </div>

      {awards.length > 0 && (
        <div className="container">
          <AwardGallery awards={awards}>
            <div className="section-heading">
              <span className="eyebrow">AWARDS &amp; APPOINTMENTS</span>
              <h2>수상 및 위촉</h2>
            </div>
          </AwardGallery>
        </div>
      )}
    </section>
  );
}