// 블로그의 예전 글까지 한 번에 가져오는 스크립트입니다. (처음 한 번만 내 PC에서 실행)
// 실행: node scripts/import-blog-history.mjs            → 가져올 글 수만 확인 (파일은 안 바꿈)
//       node scripts/import-blog-history.mjs --save     → data/blog-posts.json에 추가 저장
//
// - 평소 3시간마다 도는 sync-blog.mjs는 RSS라서 최근 50개만 보입니다. 그보다 오래된 글을 채우는 용도예요.
// - 이미 저장된 글은 건드리지 않고, 없는 글만 '인사이트'로 추가합니다. 분류는 data/blog-overrides.json으로 합니다.
// - 네이버 블로그 목록을 두 가지 방법으로 시도합니다. (모바일 목록 → PC 목록 + 글 정보)

import { readFile, rename, writeFile } from "node:fs/promises";

const BLOG_ID = "nomusa91";
const DATA_FILE = new URL("../data/blog-posts.json", import.meta.url);
const SAVE = process.argv.includes("--save");
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
function decodeEntities(text = "") {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return NAMED[code.toLowerCase()] ?? whole;
  });
}
const plain = (text = "") => decodeEntities(String(text).replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

// "[천안 노무사/아산 노무사] 제목 [노무법인 현명]" → "제목" (sync-blog.mjs와 같은 규칙)
function displayTitle(title) {
  return title
    .replace(/^\[[^\]]*노무사[^\]]*\]\s*/, "")
    .replace(/\s*\[노무법인\s*현명\]\s*$/, "")
    .trim();
}

function isoDate(value) {
  return new Date(value).toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

// "2025. 3. 10." 같은 날짜 → ISO. "3시간 전"처럼 상대 날짜면 오늘 날짜.
function parseKoreanDate(text = "") {
  const match = String(text).match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (!match) return isoDate(Date.now());
  const [, y, m, d] = match;
  return isoDate(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T09:00:00+09:00`);
}

// 네이버 이미지 서버(pstatic.net)의 https 주소만 씁니다.
function safeImage(src = "") {
  try {
    const url = new URL(decodeEntities(src));
    if (url.protocol === "https:" && (url.hostname === "pstatic.net" || url.hostname.endsWith(".pstatic.net"))) return url.href;
  } catch {
    // 주소 형식이 아니면 이미지 없음
  }
  return "";
}

async function getText(url, referer) {
  const response = await fetch(url, {
    headers: { "User-Agent": UA, Referer: referer ?? `https://m.blog.naver.com/${BLOG_ID}`, Accept: "*/*" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`응답 오류 ${response.status} (${url})`);
  return response.text();
}

// 방법 1: 모바일 블로그 목록 (제목·요약·대표 이미지·날짜가 한 번에 옴)
async function listFromMobile() {
  const posts = [];
  for (let page = 1; page <= 100; page += 1) {
    const text = await getText(
      `https://m.blog.naver.com/api/blogs/${BLOG_ID}/post-list?categoryNo=0&itemCount=30&page=${page}`,
    );
    const data = JSON.parse(text);
    const items = data?.result?.items;
    if (!Array.isArray(items)) throw new Error("모바일 목록 형식이 예상과 다릅니다.");
    if (items.length === 0) break;
    for (const item of items) {
      const id = String(item.logNo ?? "");
      const title = plain(item.titleWithInspectMessage ?? item.title ?? "");
      if (!/^\d+$/.test(id) || !title) continue;
      posts.push({
        id,
        title,
        date: Number.isFinite(Number(item.addDate)) ? isoDate(Number(item.addDate)) : parseKoreanDate(item.addDate),
        excerpt: plain(item.briefContents ?? ""),
        image: safeImage(item.thumbnailUrl ?? ""),
      });
    }
    console.log(`  모바일 목록 ${page}쪽: 누적 ${posts.length}개`);
    await wait(300);
  }
  return posts;
}

// 방법 2: PC 블로그 글 목록 + 글마다 모바일 페이지에서 요약·이미지 읽기
async function listFromDesktop() {
  const list = [];
  for (let page = 1; page <= 100; page += 1) {
    const text = await getText(
      `https://blog.naver.com/PostTitleListAsync.naver?blogId=${BLOG_ID}&viewdate=&currentPage=${page}&categoryNo=0&parentCategoryNo=0&countPerPage=30`,
      `https://blog.naver.com/${BLOG_ID}`,
    );
    const data = JSON.parse(text.replace(/\\'/g, "'"));
    const items = data?.postList;
    if (!Array.isArray(items)) throw new Error("PC 목록 형식이 예상과 다릅니다.");
    const fresh = items.filter((item) => !list.some((saved) => saved.logNo === item.logNo));
    if (fresh.length === 0) break; // 마지막 쪽을 넘으면 같은 목록이 반복됩니다.
    list.push(...fresh);
    console.log(`  PC 목록 ${page}쪽: 누적 ${list.length}개`);
    if (Number(data.totalCount) && list.length >= Number(data.totalCount)) break;
    await wait(300);
  }
  return list
    .filter((item) => item.isPostNotOpen !== "true")
    .map((item) => ({
      id: String(item.logNo),
      title: plain(decodeURIComponent(String(item.title ?? "").replace(/\+/g, " "))),
      date: parseKoreanDate(item.addDate),
      excerpt: "",
      image: "",
    }))
    .filter((post) => /^\d+$/.test(post.id) && post.title);
}

async function fillFromPostPage(post) {
  try {
    const html = await getText(`https://m.blog.naver.com/PostView.naver?blogId=${BLOG_ID}&logNo=${post.id}`);
    const meta = (name) =>
      html.match(new RegExp(`<meta[^>]+property=["']og:${name}["'][^>]*content=["']([^"']*)["']`, "i"))?.[1] ?? "";
    post.excerpt = plain(meta("description"));
    post.image = safeImage(meta("image"));
  } catch (error) {
    console.warn(`  ${post.id} 요약을 읽지 못했습니다. (${error.message})`);
  }
}

async function main() {
  const saved = JSON.parse(await readFile(DATA_FILE, "utf8"));
  const known = new Set(saved.posts.map((post) => post.id));

  let found;
  try {
    console.log("방법 1: 모바일 블로그 목록을 읽습니다.");
    found = await listFromMobile();
  } catch (error) {
    console.warn(`방법 1 실패 (${error.message}). 방법 2로 다시 시도합니다.`);
    found = await listFromDesktop();
    const missing = found.filter((post) => !known.has(post.id));
    console.log(`글마다 요약·이미지를 읽습니다. (${missing.length}개, 1~2분 걸려요)`);
    for (const post of missing) {
      await fillFromPostPage(post);
      await wait(300);
    }
  }

  const unique = [...new Map(found.map((post) => [post.id, post])).values()];
  const newPosts = unique.filter((post) => !known.has(post.id));
  console.log(`블로그 전체 ${unique.length}개 / 이미 저장 ${unique.length - newPosts.length}개 / 새로 추가할 글 ${newPosts.length}개`);
  if (newPosts.length > 0) {
    const sample = newPosts.slice(-3).map((post) => `${post.date.slice(0, 10)} ${post.title.slice(0, 40)}`);
    console.log(`가장 오래된 글: \n  ${sample.join("\n  ")}`);
  }
  if (!SAVE) {
    console.log("확인만 했습니다. 저장하려면: node scripts/import-blog-history.mjs --save");
    return;
  }
  if (newPosts.length === 0) return;

  const added = newPosts.map((post) => ({
    id: post.id,
    title: post.title,
    displayTitle: displayTitle(post.title),
    date: post.date,
    url: `https://blog.naver.com/${BLOG_ID}/${post.id}`,
    excerpt: post.excerpt,
    image: post.image,
    tags: [],
    section: "insights",
    hidden: false,
  }));
  const key = (post) => `${post.date} ${post.id}`;
  const posts = [...saved.posts, ...added].sort((a, b) => (key(a) < key(b) ? 1 : key(a) > key(b) ? -1 : 0));
  const temp = new URL("../data/blog-posts.tmp.json", import.meta.url);
  await writeFile(temp, `${JSON.stringify({ ...saved, updatedAt: new Date().toISOString(), posts }, null, 2)}\n`, "utf8");
  await rename(temp, DATA_FILE);
  console.log(`저장 완료: 전체 ${posts.length}개 (새로 ${added.length}개)`);
}

main().catch((error) => {
  console.error(`가져오지 못했습니다: ${error.message}`);
  process.exitCode = 1;
});