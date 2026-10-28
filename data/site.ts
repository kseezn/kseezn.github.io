// 홈페이지에 나오는 법인 정보와 문구를 이 파일 하나에서 관리합니다.
// 빈 문자열("")로 둔 항목은 화면에서 자동으로 숨겨집니다. 확인된 정보만 채워 주세요.

export const site = {
  name: "노무법인 현명",
  englishName: "HYEONMYEONG",
  blog: "https://blog.naver.com/nomusa91",
  youtube: "https://www.youtube.com/@wiselabor",
  phone: "041-556-5027", // 대표전화 (천안 본사)
  fax: "041-557-5027",
  email: "",
  hours: "평일 09:30 - 17:30", // 예: "평일 09:00 - 18:00"
  address: "충남 천안시 동남구 청수14로 102, 에이스법조타워 606~607호",
  mapUrl: "https://naver.me/xumadMhs", // 네이버 지도 링크
  kakao: "https://pf.kakao.com/_RJyIG/chat", // 카카오톡 채널 링크
  representative: "이철",
  businessNumber: "435-86-00874",
  naverMapKeyId: "rph088lnxz", // 네이버 지도 Client ID (아임웹 때 쓰던 것). 비우면 지도 대신 '네이버 지도에서 보기' 버튼이 나옵니다.
};

// 메인 첫 화면(남색 영역)
export const hero = {
  eyebrow: "기업과 근로자를 위한 인사·노무 파트너",
  title: ["일터의 고민을 함께 풀어가는", "노무법인 현명"],
  description: "복잡한 인사노무 문제를 이해하기 쉽게 정리하고, 상황에 맞는 해결 방향을 함께 살펴봅니다.",
  message: "인사노무 자문부터 노동사건 대응까지, 현명과 상의하세요.",
  badges: ["인사·노무 자문", "노동사건 대응", "조사·컨설팅"],
};

// 첫 화면 아래 흰색 4칸. 실적 숫자가 생기기 전까지는 업무 키워드를 씁니다.
export const strengths = [
  { value: "인사노무", label: "사업장 운영에 필요한 자문" },
  { value: "노동사건", label: "쟁점과 사실관계 검토" },
  { value: "컨설팅", label: "사업장에 맞는 제도 정비" },
  { value: "현명 소식", label: "블로그에서 전하는 이야기" },
];

export type Service = {
  slug: string; // 주소에 쓰이는 영문 이름 → /services/slug/
  title: string;
  summary: string;
  lead: string;
  tasks: string[];
};

// 업무분야 10개 (초안). 현명이 실제로 하는 업무에 맞게 고쳐 주세요.
export const services: Service[] = [
  {
    slug: "industrial-safety",
    title: "산업안전·중대재해",
    summary: "사업장의 안전관리 과제와 대응 방향을 검토합니다.",
    lead: "안전한 일터를 위한 준비",
    tasks: ["안전보건관리체계 점검", "사고 발생 시 대응 방향 검토", "관련 규정과 운영 절차 정비"],
  },
  {
    slug: "hr-advisory",
    title: "인사·노무 자문",
    summary: "채용부터 퇴직까지 인사노무 운영을 함께 살펴봅니다.",
    lead: "일상적인 노무관리의 든든한 기반",
    tasks: ["근로계약·취업규칙 검토", "임금·근로시간 관련 자문", "인사 운영상 쟁점 검토"],
  },
  {
    slug: "payroll",
    title: "급여 아웃소싱",
    summary: "급여 및 인사자료 관리 업무를 지원합니다.",
    lead: "정확한 급여관리의 시작",
    tasks: ["급여자료 검토", "급여대장·명세서 관리", "4대보험 관련 업무 협의"],
  },
  {
    slug: "case-representation",
    title: "노동사건 대리",
    summary: "사건의 사실관계와 쟁점을 정리하고 대응합니다.",
    lead: "사실관계에 기초한 사건 대응",
    tasks: ["해고·징계 관련 사건 검토", "임금체불 관련 사건 검토", "주장·증거자료 정리"],
  },
  {
    slug: "workplace-harassment",
    title: "직장 내 괴롭힘 조사",
    summary: "조사 절차와 사실관계 확인, 후속 조치를 지원합니다.",
    lead: "공정한 조사를 위한 절차와 준비",
    tasks: ["조사계획 수립", "당사자·참고인 면담", "조사보고서 및 후속 조치 검토"],
  },
  {
    slug: "hr-consulting",
    title: "HR 컨설팅",
    summary: "사업장 특성에 맞는 인사제도와 규정을 정비합니다.",
    lead: "조직에 맞는 인사제도 설계",
    tasks: ["취업규칙·인사규정 정비", "임금·평가체계 검토", "제도 운영 개선"],
  },
  {
    slug: "risk-assessment",
    title: "위험성평가",
    summary: "현장의 유해·위험요인과 개선 과제를 살펴봅니다.",
    lead: "위험요인 확인부터 개선까지",
    tasks: ["현장 현황과 자료 확인", "위험요인 검토", "개선 과제 정리"],
  },
  {
    slug: "sanjae-center",
    title: "산재보상",
    summary: "재해 경위와 자료를 확인하고 보상 절차를 검토합니다.",
    lead: "산재보상을 위한 자료와 절차",
    tasks: ["재해 경위 파악", "업무 관련 자료 검토", "산재 신청 및 불승인 대응 검토"],
  },
  {
    slug: "education",
    title: "교육·출강",
    summary: "대상과 목적에 맞는 인사노무 교육을 준비합니다.",
    lead: "현장에서 활용하는 인사노무 교육",
    tasks: ["교육 주제와 대상 협의", "교육안 구성", "일정·진행 방식 협의"],
  },
  {
    slug: "labor-inspection",
    title: "근로감독 대응",
    summary: "노무관리 자료를 점검하고 시정 과제를 정리합니다.",
    lead: "자료 점검부터 개선까지",
    tasks: ["근로계약·임금자료 확인", "근태 및 인사자료 점검", "개선 사항 및 대응 방향 정리"],
  },
];

// 메인 "주요 업무" 카드 3개에 보여 줄 업무 (위 services의 slug)
export const coreSlugs = ["industrial-safety", "sanjae-center", "workplace-harassment"];

// 업무 상세 페이지의 진행 절차
export const processSteps = ["문의 및 일정 협의", "현황·자료 확인", "업무 범위 협의", "진행 및 결과 안내"];

export const faqs = [
  {
    q: "상담 전에 어떤 내용을 준비하면 좋을까요?",
    a: "문의하실 내용을 간단히 정리하고, 관련된 계약서나 안내문 등이 있다면 상담 시 준비해 주세요. 구체적인 필요 자료는 상담 과정에서 안내받으실 수 있습니다.",
  },
  {
    q: "기업 자문과 개별 사건 상담을 구분해서 신청해야 하나요?",
    a: "문의하실 때 기업 운영에 관한 자문인지, 특정 사건에 관한 상담인지 알려주시면 관련 내용을 확인하기 쉽습니다.",
  },
  {
    q: "교육이나 규정정비도 문의할 수 있나요?",
    a: "희망하는 업무 범위와 일정을 알려주시면 진행 가능 여부와 필요한 내용을 확인합니다.",
  },
  {
    q: "상담 및 업무 수행 비용은 어떻게 확인하나요?",
    a: "업무 범위와 자료를 확인한 후 개별적으로 협의할 사항입니다. 구체적인 내용은 상담 시 문의해 주세요.",
  },
];

export type Office = {
  id: string; // 주소 끝에 붙는 영문 이름 (/location/#cheonan)
  name: string;
  phone: string;
  address: string; // 지도에서 위치를 찾을 도로명 주소 (건물 번호까지만)
  detail: string; // 층·호수·건물명
  lat?: number; // 지도 위치가 조금 어긋나면 위도·경도를 직접 넣으세요.
  lng?: number;
  naverMapUrl?: string; // 네이버 지도 '공유' 링크를 넣으면 길찾기 버튼이 그 장소로 바로 열립니다.
};

// 사무실 목록. 오시는 길 페이지, 상담 문의 페이지, 푸터에 함께 쓰입니다.
export const offices: Office[] = [
  {
    id: "cheonan",
    name: "천안 본사",
    phone: "041-556-5027",
    address: "충청남도 천안시 동남구 청수14로 102",
    detail: "6층 606·607호 (청당동, 에이스법조타워)",
    lat: 36.785563,
    lng: 127.157387,
    naverMapUrl: "https://naver.me/xumadMhs",
  },
  {
    id: "asan",
    name: "아산 지사",
    phone: "041-541-9333",
    address: "충청남도 아산시 탕정면 이순신대로 442",
    detail: "3층 306호 (스마트타워 빌딩)",
    lat: 36.796986,
    lng: 127.052831,
    naverMapUrl: "https://naver.me/xDC9Lle1",
  },
  {
    id: "seoul",
    name: "서울 지사",
    phone: "02-2138-0457",
    address: "서울특별시 중구 퇴계로 197",
    detail: "5층 512호 (필동2가, 충무빌딩)",
    lat: 37.561433,
    lng: 126.993907,
    naverMapUrl: "https://naver.me/xcABpfKl",
  },
];

// 네이버 지도에서 이 사무실을 여는 주소 (공유 링크가 없으면 주소로 검색)
export function naverMapLink(office: Office) {
  return office.naverMapUrl || `https://map.naver.com/p/search/${encodeURIComponent(office.address)}`;
}