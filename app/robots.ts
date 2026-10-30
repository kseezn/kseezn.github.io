import type { MetadataRoute } from "next";

// 검색엔진에게 "모든 페이지를 봐도 된다"고 알려 주는 robots.txt를 만듭니다.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://yeshm.co.kr/sitemap.xml",
  };
}