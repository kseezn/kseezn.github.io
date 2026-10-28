import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/Common";
import ScrollReveal from "@/components/ScrollReveal";
import SiteHeader from "@/components/SiteHeader";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | 인사노무 자문과 노동사건 상담`,
    template: `%s | ${site.name}`,
  },
  description: "노무법인 현명의 업무분야, 인사노무 인사이트와 법인 소식을 안내합니다.",
  // 법인 정보를 다 채우기 전까지 검색엔진에 노출되지 않게 막아 둡니다. 정식 공개 때 이 줄을 지우세요.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main">
          본문 바로가기
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}