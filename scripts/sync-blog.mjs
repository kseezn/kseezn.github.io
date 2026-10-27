// 네이버 블로그 RSS(최근 글 50개)를 읽어 data/blog-posts.json에 합쳐 저장합니다.
// 실행: npm run sync:blog   (GitHub Actions가 3시간마다 자동으로 실행합니다)
// - 이미 저장된 글은 지우지 않고 쌓아 둡니다. (RSS에는 최근 글만 나오기 때문)
// - 분류: data/blog-overrides.json 지정 > '현명소식' 태그 > 'HR뉴스' 태그 > 인사이트
// - 블로그 접속이 실패하면 기존 파일을 그대로 두고, 빌드는 멈추지 않습니다.

import { readFile, rename, writeFile } from "node:fs/promises";

const BLOG_ID = "nomusa91";
const RSS_URL = `https://rss.blog.naver.com/${BLOG_ID}.xml`;
const DATA_FILE = new URL("../data/blog-posts.json", import.meta.url);
const OVERRIDES_FILE = new URL("../data/blog-overrides.json", import.meta.url);
const SECTIONS = ["insights", "news", "hrnews"];

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

// &amp; &#39; 같은 표기를 원래 글자로 바꿉니다.
function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return NAMED[code.toLowerCase()] ?? whole;
  });
}

// XML 요소 안의 글자를 꺼냅니다. (<![CDATA[...]]> 형태와 &lt; 형태 모두 처리)
function field(item, tag) {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`));
  if (!match) return "";
  const raw = match[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return cdata ? cdata[1] : decodeEntities(raw);
}

// 본문 HTML에서 글자만 뽑아 도입부를 만듭니다.
function toExcerpt(html) {
  // 태그는 영문자로 시작하는 <p>, </div> 같은 것만 지웁니다. (<탄력적 근로시간제> 같은 글은 남김)
  const text = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(p|br|div)\b[^>]*>/gi, " ")
    .replace(/<\/?[a-zA-Z][^>]*>/g, "");
  return decodeEntities(text).replace(/\s+/g, " ").trim().replace(/\.{3,}$/, "…");
}

// 첫 번째 이미지 주소. 네이버 이미지 서버(pstatic.net)의 https 주소만 씁니다.
function firstImage(html) {
  for (const match of html.matchAll(/<img\b[^>]*?\bsrc\s*=\s*(["'])(.*?)\1/gi)) {
    const src = decodeEntities(match[2]);
    try {
      const url = new URL(src);
      if (url.protocol === "https:" && (url.hostname === "pstatic.net" || url.hostname.endsWith(".pstatic.net"))) return src;
    } catch {
      // 주소 형식이 아니면 다음 이미지를 봅니다.
    }
  }
  return "";
}

// "[천안 노무사/아산 노무사] 제목 [노무법인 현명]" → "제목"
function displayTitle(title) {
  return title
    .replace(/^\[[^\]]*노무사[^\]]*\]\s*/, "")
    .replace(/\s*\[노무법인\s*현명\]\s*$/, "")
    .trim();
}

// 날짜를 "2026-10-23T05:13:25+00:00" 형태로 맞춥니다. (기존 파일과 같은 형태)
function toIsoDate(value) {
  const time = Date.parse(value);
  if (Number.isNaN(time)) throw new Error(`날짜를 읽을 수 없습니다: ${value}`);
  return new Date(time).toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

function parseFeed(xml) {
  if (xml.length > 5_000_000) throw new Error("RSS가 예상보다 큽니다.");
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error("DTD/ENTITY가 포함된 RSS는 처리하지 않습니다.");
  if (!/<rss[\s>]/.test(xml) || !/<channel[\s>]/.test(xml)) throw new Error("정상 RSS 문서가 아닙니다.");

  const posts = [];
  for (const item of xml.match(/<item[\s>][\s\S]*?<\/item>/g) ?? []) {
    const link = field(item, "guid") || field(item, "link");
    let id;
    try {
      const url = new URL(link);
      const match = url.pathname.match(new RegExp(`^/${BLOG_ID}/(\\d+)/?$`));
      if (!["http:", "https:"].includes(url.protocol) || url.hostname !== "blog.naver.com" || !match) continue;
      id = match[1];
    } catch {
      continue; // 이 블로그 글 주소가 아니면 건너뜁니다.
    }
    const title = field(item, "title").trim();
    if (!title) continue;
    const description = field(item, "description");
    posts.push({
      id,
      title,
      displayTitle: displayTitle(title),
      date: toIsoDate(field(item, "pubDate")),
      url: `https://blog.naver.com/${BLOG_ID}/${id}`,
      excerpt: toExcerpt(description),
      image: firstImage(description),
      tags: field(item, "tag")
        .split(/[,\n]/)
        .map((tag) => tag.trim().replace(/^#+/, ""))
        .filter(Boolean),
      section: "insights",
      hidden: false,
    });
  }
  if (posts.length === 0) throw new Error("처리할 수 있는 글이 없습니다.");
  return posts;
}

// 저장된 글 + 새로 읽은 글을 합치고, 분류와 숨김을 다시 적용합니다.
function mergePosts(previous, incoming, overrides) {
  const merged = new Map(previous.map((post) => [post.id, { ...post }]));
  for (const post of incoming) merged.set(post.id, { ...post });

  for (const post of merged.values()) {
    const entry = overrides[post.id] ?? {};
    const tags = post.tags ?? [];
    const bySection = tags.includes("현명소식") ? "news" : tags.includes("HR뉴스") ? "hrnews" : "insights";
    post.section = entry.section ?? bySection;
    if (!SECTIONS.includes(post.section)) throw new Error(`잘못된 분류: ${post.id}`);
    post.hidden = Boolean(entry.hidden);
    post.displayTitle = entry.displayTitle || displayTitle(post.title);
  }
  // 최신 글이 먼저 오도록 정렬 (날짜가 같으면 글 번호로)
  const key = (post) => `${post.date} ${post.id}`;
  return [...merged.values()].sort((a, b) => (key(a) < key(b) ? 1 : key(a) > key(b) ? -1 : 0));
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  // 테스트용: node scripts/sync-blog.mjs --feed-file 샘플.xml
  const fileIndex = process.argv.indexOf("--feed-file");
  let xml;
  if (fileIndex > -1) {
    xml = await readFile(process.argv[fileIndex + 1], "utf8");
  } else {
    const response = await fetch(RSS_URL, {
      headers: { "User-Agent": "Hyeonmyeong-RSS-Sync/1.0", Accept: "application/rss+xml, application/xml" },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`블로그 응답 오류 ${response.status}`);
    xml = await response.text();
  }

  const saved = await readJson(DATA_FILE, { posts: [] });
  const overrides = await readJson(OVERRIDES_FILE, {});
  const posts = mergePosts(saved.posts, parseFeed(xml), overrides);

  if (JSON.stringify(posts) === JSON.stringify(saved.posts)) {
    console.log(`블로그: 변경 없음 (글 ${posts.length}개)`);
    return;
  }
  const added = posts.length - saved.posts.length;
  const data = { source: RSS_URL, updatedAt: new Date().toISOString(), posts };
  const temp = new URL("../data/blog-posts.tmp.json", import.meta.url);
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temp, DATA_FILE);
  console.log(`블로그: 저장 완료 (전체 ${posts.length}개, 새 글 ${added}개)`);
}

main().catch((error) => {
  console.warn(`블로그 글을 가져오지 못했습니다. 저장된 목록으로 계속합니다. (${error.message})`);
});