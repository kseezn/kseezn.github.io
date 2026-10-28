// 직원 정보. 구성원 페이지에만 나오고, 메인 화면에는 나오지 않습니다.
// 사진 없이 이름·직책·이력만 보여 줍니다. 위에서부터 적은 순서대로 나와요.

export type Staff = {
  name: string;
  role: string; // 직책. 예: "실장", "주임"
  office: "cheonan" | "asan" | "seoul"; // data/site.ts의 offices id
  careers: string[]; // 이력 (한 줄씩)
};

export const staff: Staff[] = [
  // ── 천안 본사 ──
  { name: "진재용", role: "실장", office: "cheonan", careers: ["급여아웃소싱 전문"] },
  { name: "김은정", role: "차장", office: "cheonan", careers: ["급여아웃소싱 전문"] },
  { name: "김도연", role: "과장", office: "cheonan", careers: ["급여아웃소싱 전문"] },
  { name: "백예지", role: "대리", office: "cheonan", careers: ["급여아웃소싱 전문"] },
  { name: "강혁준", role: "주임", office: "cheonan", careers: ["급여아웃소싱 전문"] },
  { name: "이혜민", role: "주임", office: "cheonan", careers: ["급여아웃소싱 전문"] },
  { name: "유지원", role: "주임", office: "cheonan", careers: ["급여아웃소싱 전문"] },
];