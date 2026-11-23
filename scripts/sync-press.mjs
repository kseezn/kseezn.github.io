// 네이버 뉴스 검색으로 법인·소속 노무사 관련 기사를 찾아 data/press-articles.json에 저장합니다.
// 실행: npm run sync:press   (GitHub에서 3시간마다 자동으로 실행됩니다)
//
// - "노무법인 현명"이 들어간 기사 → 언론 보도 페이지에 바로 게시
// - 노무사 이름 + "노무사"로만 찾은 기사 → 후보로 저장 (확인 후 data/press-overrides.json의 show에 넣으면 게시)
// - 기사 본문은 옮기지 않고 제목·언론사·날짜·링크만 저장합니다.
// - 네이버 API 키(NAVER_API_HUB_ID, NAVER_API_HUB_SECRET)가 없거나 검색이 실패하면
//   저장된 목록을 그대로 두고, 빌드는 멈추지 않습니다.

import { createHash } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";

const API_URL = "https://naverapihub.apigw.ntruss.com/search/v1/news"; // 네이버 클라우드 NAVER API HUB 뉴스 검색
const DATA_FILE = new URL("../data/press-articles.json", import.meta.url);
const MEMBERS_FILE = new URL("../data/members.ts", import.meta.url);
const FIRM = "노무법인 현명";
const FIRM_PATTERN = /노무법인\s*현명/;
const MAX_SAVED = 300; // 저장해 두는 기사 수 (오래된 것부터 정리)

// 기사 주소의 도메인 → 언론사 이름 (목록에 없으면 도메인을 그대로 보여 줍니다)
const OUTLETS = {
  "yna.co.kr": "연합뉴스",
  "yonhapnewstv.co.kr": "연합뉴스TV",
  "newsis.com": "뉴시스",
  "news1.kr": "뉴스1",
  "chosun.com": "조선일보",
  "joongang.co.kr": "중앙일보",
  "donga.com": "동아일보",
  "hani.co.kr": "한겨레",
  "khan.co.kr": "경향신문",
  "hankookilbo.com": "한국일보",
  "kmib.co.kr": "국민일보",
  "seoul.co.kr": "서울신문",
  "segye.com": "세계일보",
  "munhwa.com": "문화일보",
  "hankyung.com": "한국경제",
  "mk.co.kr": "매일경제",
  "sedaily.com": "서울경제",
  "edaily.co.kr": "이데일리",
  "mt.co.kr": "머니투데이",
  "asiae.co.kr": "아시아경제",
  "fnnews.com": "파이낸셜뉴스",
  "heraldcorp.com": "헤럴드경제",
  "etnews.com": "전자신문",
  "nocutnews.co.kr": "노컷뉴스",
  "ohmynews.com": "오마이뉴스",
  "pressian.com": "프레시안",
  "kbs.co.kr": "KBS",
  "imbc.com": "MBC",
  "sbs.co.kr": "SBS",
  "jtbc.co.kr": "JTBC",
  "ytn.co.kr": "YTN",
  "mbn.co.kr": "MBN",
  "ichannela.com": "채널A",
  "tjmbc.co.kr": "대전MBC",
  "tjb.co.kr": "TJB대전방송",
  "cctoday.co.kr": "충청투데이",
  "daejonilbo.com": "대전일보",
  "joongdo.co.kr": "중도일보",
  "ccdn.co.kr": "충청일보",
  "cctimes.kr": "충청타임즈",
  "dynews.co.kr": "동양일보",
  "ggilbo.com": "금강일보",
  "inews365.com": "충북일보",
  "chungnamilbo.co.kr": "충남일보",
  "labortoday.co.kr": "매일노동뉴스",
  "worklaw.co.kr": "노동법률",
  "hrinsight.co.kr": "HR Insight",
};

// 검색 결과의 <b> 표시와 &quot; 같은 특수문자 표기를 정리합니다.
function clean(text = "") {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function outletName(url) {
  try {
    const host = new URL(url).hostname.replace(/^(www|m|news|n)\./, "");
    const key = Object.keys(OUTLETS).find((domain) => host === domain || host.endsWith(`.${domain}`));
    return key ? OUTLETS[key] : host;
  } catch {
    return "";
  }
}

// 구성원 이름을 data/members.ts에서 읽어 옵니다. (구성원이 바뀌면 검색어도 저절로 바뀜)
async function memberNames() {
  const source = await readFile(MEMBERS_FILE, "utf8");
  return [...source.matchAll(/^\s*name:\s*"([^"]+)"/gm)].map((match) => match[1]);
}

async function search(query, id, secret) {
  const url = `${API_URL}?query=${encodeURIComponent(query)}&display=100&sort=date`;
  const response = await fetch(url, {
    headers: { "X-NCP-APIGW-API-KEY-ID": id, "X-NCP-APIGW-API-KEY": secret },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`네이버 응답 오류 ${response.status} (${query})`);
  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}

async function readSaved() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    return { updatedAt: null, articles: [] };
  }
}

async function main() {
  const id = process.env.NAVER_API_HUB_ID;
  const secret = process.env.NAVER_API_HUB_SECRET;
  if (!id || !secret) {
    console.log("언론 보도: 네이버 API 키가 없어 검색을 건너뜁니다.");
    return;
  }

  const names = await memberNames();
  const queries = [FIRM, ...names.map((name) => `${name} 노무사`)];
  const saved = await readSaved();
  const articles = new Map(saved.articles.map((article) => [article.id, article]));
  let added = 0;

  for (const query of queries) {
    const items = await search(query, id, secret);
    for (const item of items) {
      const url = item.originallink || item.link;
      if (!/^https?:\/\//.test(url ?? "")) continue;
      const title = clean(item.title);
      const text = `${title} ${clean(item.description)}`;
      const date = new Date(item.pubDate);
      if (!title || Number.isNaN(date.getTime())) continue;

      // 법인 이름이 있으면 바로 게시, 노무사 이름 + "노무사"만 있으면 후보로
      const firm = FIRM_PATTERN.test(text);
      const members = names.filter((name) =>
        new RegExp(`${name}\\s*(대표\\s*|부대표\\s*|책임\\s*|공인\\s*)?노무사`).test(text),
      );
      if (!firm && members.length === 0) continue; // 검색어와 상관없는 기사

      const articleId = createHash("sha1").update(url).digest("hex").slice(0, 12);
      if (articles.has(articleId)) continue; // 이미 저장된 기사는 그대로 둡니다.
      articles.set(articleId, {
        id: articleId,
        title,
        source: outletName(url),
        date: date.toISOString(),
        url,
        naverUrl: item.link && item.link !== url ? item.link : undefined,
        matched: firm ? [FIRM, ...members] : members,
        status: firm ? "shown" : "pending",
      });
      added += 1;
    }
    await new Promise((resolve) => setTimeout(resolve, 200)); // 너무 빠르게 연달아 부르지 않게
  }

  if (added === 0) {
    console.log(`언론 보도: 새 기사 없음 (저장 ${articles.size}건)`);
    return;
  }

  const list = [...articles.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_SAVED);
  const data = { updatedAt: new Date().toISOString(), articles: list };
  const temp = new URL("../data/press-articles.tmp.json", import.meta.url);
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temp, DATA_FILE);
  console.log(`언론 보도: 새 기사 ${added}건 저장 (전체 ${list.length}건)`);
}

main().catch((error) => {
  console.warn(`언론 보도를 검색하지 못했습니다. 저장된 목록으로 계속합니다. (${error.message})`);
});