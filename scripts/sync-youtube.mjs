// 유튜브 채널의 최근 영상 목록(RSS)을 읽어 data/youtube-videos.json에 저장합니다.
// 실행: npm run sync:youtube   (npm run build 할 때도 자동으로 먼저 실행됩니다)
// 유튜브 접속이 실패하면 기존 파일을 그대로 두고, 빌드는 멈추지 않습니다.

import { readFile, rename, writeFile } from "node:fs/promises";

const CHANNEL_ID = "UCIefBnoyqD7sQTROpgY9Mlw"; // 현명한 노무사 (@wiselabor)
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const DATA_FILE = new URL("../data/youtube-videos.json", import.meta.url);

// XML 안의 &amp; 같은 특수문자 표기를 원래 글자로 바꿉니다.
function decode(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function pick(block, pattern) {
  const match = block.match(pattern);
  return match ? decode(match[1]) : "";
}

// 피드 글자에서 영상 목록을 꺼냅니다.
function parseFeed(xml) {
  if (!xml.includes("<feed")) throw new Error("유튜브 피드 형식이 아닙니다.");
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const videos = [];
  for (const entry of entries) {
    const id = pick(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = pick(entry, /<title>([\s\S]*?)<\/title>/);
    const published = pick(entry, /<published>([^<]+)<\/published>/);
    // 영상 ID는 영문·숫자·-·_ 11글자입니다. 형식이 다르면 건너뜁니다.
    if (!/^[A-Za-z0-9_-]{11}$/.test(id) || !title || Number.isNaN(Date.parse(published))) continue;
    videos.push({
      id,
      title,
      published: new Date(published).toISOString(),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }
  if (videos.length === 0) throw new Error("피드에서 영상을 찾지 못했습니다.");
  return videos.sort((a, b) => b.published.localeCompare(a.published));
}

async function readSaved() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    return { videos: [] };
  }
}

async function main() {
  // 테스트용: node scripts/sync-youtube.mjs --feed-file 샘플.xml
  const fileIndex = process.argv.indexOf("--feed-file");
  let xml;
  if (fileIndex > -1) {
    xml = await readFile(process.argv[fileIndex + 1], "utf8");
  } else {
    const response = await fetch(FEED_URL, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`유튜브 응답 오류 ${response.status}`);
    xml = await response.text();
  }

  const videos = parseFeed(xml);
  const saved = await readSaved();
  if (JSON.stringify(saved.videos) === JSON.stringify(videos)) {
    console.log(`유튜브: 변경 없음 (영상 ${videos.length}개)`);
    return;
  }

  // 임시 파일에 먼저 쓰고 바꿔치기해서, 중간에 멈춰도 파일이 깨지지 않게 합니다.
  const data = { channel: `https://www.youtube.com/channel/${CHANNEL_ID}`, updatedAt: new Date().toISOString(), videos };
  const temp = new URL("../data/youtube-videos.tmp.json", import.meta.url);
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temp, DATA_FILE);
  console.log(`유튜브: 영상 ${videos.length}개 저장`);
}

main().catch((error) => {
  console.warn(`유튜브 영상 목록을 가져오지 못했습니다. 저장된 목록으로 계속합니다. (${error.message})`);
});