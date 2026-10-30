// 직원 정보. 구성원 페이지에만 나오고, 메인 화면에는 나오지 않습니다.
// 사진 + 이름·직책·이력을 보여 줍니다. 사진이 없으면 대체 이미지가 나와요. 위에서부터 적은 순서대로 나와요.

export type Staff = {
  name: string;
  role: string; // 직책. 예: "실장", "주임"
  office: "cheonan" | "asan" | "seoul"; // data/site.ts의 offices id
  careers: string[]; // 이력 (한 줄씩)
  photo?: string; // 실제 사진이 생기면 public/members에 넣고 "/members/파일이름"을 적으세요. 없으면 대체 이미지.
};

export const staff: Staff[] = [
  // ── 천안 본사 ──
  { name: "진재용", role: "실장", office: "cheonan",
    careers: ["제조업 등 급여아웃소싱 전문"] },
  { name: "김은정", role: "차장", office: "cheonan",
    careers: ["건설업 등 급여아웃소싱 전문",
      "건설업 고용·산재보험 개산보험료 신고 전문",
      "산재보험 환급 신청 전문"
    ] },
  { name: "김도연", role: "과장", office: "cheonan",
    careers: ["건설업 등 급여아웃소싱 전문",
      "건설업 고용·산재보험 개산보험료 신고 전문",
      "임채부담금 경감 신청 전문"
    ] },
  { name: "백예지", role: "대리", office: "cheonan",
    careers: ["제조업 등 급여아웃소싱 전문",
      "워라밸 장려금 신청 전문"
    ] },
  { name: "강혁준", role: "주임", office: "cheonan",
    careers: ["제조업 등 급여아웃소싱 전문"] },
  { name: "이혜민", role: "주임", office: "cheonan",
    careers: ["제조업 등 급여아웃소싱 전문"] },
  { name: "유지원", role: "주임", office: "cheonan",
    careers: ["제조업 등 급여아웃소싱 전문"] },
  // ── 아산 지사 ──
  { name: "김진우", role: "팀장", office: "asan",
    careers: ["급여아웃소싱 전문"] },
  { name: "오경희", role: "과장", office: "asan",
    careers: ["급여아웃소싱 전문"] },
];