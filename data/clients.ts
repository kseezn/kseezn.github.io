// 메인 화면 "고객사 · 수상 및 위촉" 구역의 내용입니다.
// 이미지는 public/clients, public/awards 폴더에 있습니다. (scripts/download-old-images.mjs로 받음)
// 새 로고를 넣으려면 이미지를 public/clients에 넣고 아래 목록에 한 줄을 추가하세요.

export type Client = {
  name: string; // 회사·기관 이름 (그림을 못 보는 분께 읽어 주는 글)
  logo: string; // 예: "/clients/01.jpg"
};

export type Award = {
  image: string; // 예: "/awards/01.png"
  title?: string; // 적으면 사진 아래에 이름이 나옵니다. 예: "충청남도지사 표창"
};

// 고객사 로고 목록 아래에 나오는 문구
export const clientsSummary = "약 300여 개 회원사와 함께합니다";
export const clientsDescription =
  "공공기관부터 금융·제조·의료기관까지, 다양한 사업장에 자문과 각종 서비스를 제공하고 있습니다.";

export const clients: Client[] = [
  { name: "대륙", logo: "/clients/01.jpg" },
  { name: "고용노동부", logo: "/clients/02.jpg" },
  { name: "근로복지공단", logo: "/clients/03.jpg" },
  { name: "중소벤처기업부", logo: "/clients/04.jpg" },
  { name: "충청남도교육청", logo: "/clients/05.jpg" },
  { name: "충남북부상공회의소", logo: "/clients/06.jpg" },
  { name: "충남창조경제혁신센터", logo: "/clients/07.jpg" },
  { name: "삼성화재", logo: "/clients/08.jpg" },
  { name: "메리츠화재", logo: "/clients/09.jpg" },
  { name: "삼성생명", logo: "/clients/10.jpg" },
  { name: "DB손해보험", logo: "/clients/11.jpg" },
  { name: "LH 한국토지주택공사", logo: "/clients/12.jpg" },
  { name: "천안의료원", logo: "/clients/13.jpg" },
  { name: "아산충무병원", logo: "/clients/14.jpg" },
  { name: "공주의료원", logo: "/clients/15.jpg" },
  { name: "홍성의료원", logo: "/clients/16.jpg" },
  { name: "노사발전재단", logo: "/clients/17.jpg" },
  { name: "롯데엔지니어링플라스틱스", logo: "/clients/18.jpg" },
  { name: "SAMAH", logo: "/clients/19.jpg" },
  { name: "LS ELECTRIC", logo: "/clients/20.jpg" },
  { name: "연세대학교 연세유업", logo: "/clients/21.jpg" },
  { name: "동양직업전문학교", logo: "/clients/22.jpg" },
  { name: "UI Helljet", logo: "/clients/23.jpg" },
  { name: "대한수출포장", logo: "/clients/24.jpg" },
  { name: "한국기술교육대학교", logo: "/clients/25.jpg" },
  { name: "렌텍", logo: "/clients/26.png" },
  { name: "신세계", logo: "/clients/27.png" },
  { name: "ACMST", logo: "/clients/28.png" },
  { name: "아마셀", logo: "/clients/29.png" },
  { name: "동일", logo: "/clients/30.png" },
  { name: "NMSK", logo: "/clients/31.png" },
  { name: "충청남도", logo: "/clients/32.png" },
];

// 수상·위촉장 (위에서부터 이 순서로 나옵니다)
export const awards: Award[] = [
  { image: "/awards/01.png" },
  { image: "/awards/02.png" },
  { image: "/awards/03.png" },
  { image: "/awards/04.png" },
  { image: "/awards/05.jpg" },
  { image: "/awards/06.jpg" },
  { image: "/awards/07.jpg" },
  { image: "/awards/08.jpg" },
  { image: "/awards/09.jpg" },
  { image: "/awards/10.jpg" },
  { image: "/awards/11.jpg" },
  { image: "/awards/12.jpg" },
  { image: "/awards/13.jpg" },
  { image: "/awards/14.jpg" },
  { image: "/awards/15.jpg" },
  { image: "/awards/16.jpg" },
  { image: "/awards/17.jpg" },
  { image: "/awards/18.jpg" },
];