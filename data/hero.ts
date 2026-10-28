// 메인 첫 화면(전체 화면 사진)의 장면들. 7초마다 다음 장면으로 넘어갑니다.
// 사진은 public/hero 폴더에 있습니다. 장면을 늘리려면 { … } 덩어리를 하나 더 추가하세요.
import { hero } from "@/data/site";

export type HeroSlide = {
  image: string; // 배경 사진. 예: "/hero/01.jpg" (가로 1920px 안팎 권장)
  eyebrow: string; // 제목 위 작은 영문
  title: [string, string]; // 큰 제목 두 줄 (두 번째 줄이 더 굵게)
  description: string;
  link: { href: string; label: string }; // 첫 번째 버튼
};

export const heroSlides: HeroSlide[] = [
  {
    image: "/hero/01.jpg",
    eyebrow: "HYEONMYEONG LABOR LAW FIRM",
    title: [hero.title[0], hero.title[1]],
    description: hero.description,
    link: { href: "/contact/", label: "상담 문의하기" },
  },
  {
    image: "/hero/02.jpg",
    eyebrow: "ADVISORY",
    title: ["채용부터 퇴직까지,", "든든한 인사·노무 자문"],
    description: "근로계약, 임금, 징계와 해고까지 매일의 노무 판단에 믿을 수 있는 기준을 더합니다.",
    link: { href: "/services/hr-advisory/", label: "인사·노무 자문 보기" },
  },
  {
    image: "/hero/03.jpg",
    eyebrow: "COMPENSATION & SAFETY",
    title: ["일하다 다쳤다면,", "받아야 할 보상을 빠짐없이"],
    description: "산재 신청부터 중대재해 예방 체계까지, 일터의 안전을 함께 살핍니다.",
    link: { href: "/services/sanjae-center/", label: "산재보상 보기" },
  },
];