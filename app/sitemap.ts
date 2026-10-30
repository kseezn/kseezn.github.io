import type { MetadataRoute } from "next";
import { services } from "@/data/services";

// 검색엔진에게 홈페이지의 페이지 목록을 알려 주는 sitemap.xml을 만듭니다.
// 업무분야를 추가하면 목록에도 저절로 들어가요.
export const dynamic = "force-static";

const SITE_URL = "https://yeshm.co.kr";

const pages = ["", "services", "members", "insights", "news", "hrnews", "press", "videos", "faq", "location", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((page) => ({ url: page ? `${SITE_URL}/${page}/` : `${SITE_URL}/` })),
    ...services.map((service) => ({ url: `${SITE_URL}/services/${service.slug}/` })),
  ];
}