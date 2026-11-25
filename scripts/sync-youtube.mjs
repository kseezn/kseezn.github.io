// 유튜브 채널들의 최근 영상 목록(RSS)을 읽어 data/youtube-videos.json에 저장합니다.
// 실행: npm run sync:youtube   (GitHub에서 3시간마다 자동으로 실행됩니다)
//
// - 채널 목록은 data/youtube-channels.json에 적습니다. (채널 이름, 주소, 채널 ID)
// - 여러 채널의 영상을 합쳐서 최신순으로 저장합니다. (채널마다 최근 15개씩)
// - 채널 ID를 비워 두면 채널 주소(@이름)에서 ID를 찾아 씁니다.
// - 한 채널이 실패하면 그 채널은 지난번에 저장한 영상을 그대로 쓰고, 빌드는 멈추지 않습니다.

import { readFile, rename, writeFile } from "node:fs/promises";

const CHANNELS_FILE = new URL("../data/youtube-channels.json", import.meta.url);
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
function parseFeed(xml, channelId, channelName) {
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
      channel: channelId,
      channelName,
    });
  }
  if (videos.length === 0) throw new Error("피드에서 영상을 찾지 못했습니다.");
  return videos;
}

// 채널 ID(UC로 시작하는 24글자)를 알아냅니다. 비어 있으면 채널 주소 페이지에서 찾습니다.
async function channelIdOf(channel) {
  if (/^UC[\w-]{22}$/.test(channel.id ?? "")) return channel.id;
  const url = (channel.url ?? "").trim();
  const direct = url.match(/\/channel\/(UC[\w-]{22})/);
  if (direct) return direct[1];
  if (!/^https:\/\/(www\.|m\.)?youtube\.com\/@[^/?#]+/.test(url)) {
    throw new Error(`채널 주소를 이해하지 못했습니다: ${url}`);
  }
  const response = await fetch(url, {
    headers: { "Accept-Language": "ko-KR,ko;q=0.9", "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`채널 페이지 응답 오류 ${response.status}`);
  const html = await response.text();
  const match =
    html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/) ??
    html.match(/"externalId":"(UC[\w-]{22})"/) ??
    html.match(/<meta itemprop="identifier" content="(UC[\w-]{22})"/);
  if (!match) throw new Error(`채널 ID를 찾지 못했습니다: ${url}`);
  return match[1];
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  const { channels = [] } = await readJson(CHANNELS_FILE, { channels: [] });
  const active = channels.filter((channel) => channel.id || channel.url); // 비어 있는 칸은 건너뜀
  if (active.length === 0) throw new Error("data/youtube-channels.json에 채널이 없습니다.");

  const saved = await readJson(DATA_FILE, { videos: [] });
  // 예전 형식(채널 표시 없음)으로 저장된 영상은 첫 번째 채널 것으로 봅니다.
  const savedVideos = saved.videos.map((video) => ({
    ...video,
    channel: video.channel ?? active[0].id,
    channelName: video.channelName ?? active[0].name,
  }));

  const videos = [];
  for (const channel of active) {
    const label = channel.name || channel.url || channel.id;
    try {
      const channelId = await channelIdOf(channel);
      const feed = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const response = await fetch(feed, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`유튜브 응답 오류 ${response.status}`);
      const list = parseFeed(await response.text(), channelId, channel.name);
      videos.push(...list);
      const idNote = channel.id ? "" : ` (채널 ID ${channelId} — data/youtube-channels.json의 id에 적어 두면 더 안정적)`;
      console.log(`유튜브: ${label} 영상 ${list.length}개 확인${idNote}`);
    } catch (error) {
      // 이 채널만 실패하면 지난번에 저장한 이 채널 영상을 그대로 씁니다.
      const channelId = /^UC[\w-]{22}$/.test(channel.id ?? "") ? channel.id : null;
      const kept = savedVideos.filter(
        (video) => (channelId && video.channel === channelId) || (channel.name && video.channelName === channel.name),
      );
      videos.push(...kept);
      console.warn(`유튜브: ${label} 영상을 가져오지 못해 저장된 ${kept.length}개를 씁니다. (${error.message})`);
    }
  }

  // 같은 영상이 두 번 들어가지 않게 하고, 최신순으로 정렬합니다.
  const unique = [...new Map(videos.map((video) => [video.id, video])).values()];
  unique.sort((a, b) => b.published.localeCompare(a.published));
  if (unique.length === 0) throw new Error("가져온 영상이 없습니다.");

  if (JSON.stringify(saved.videos) === JSON.stringify(unique)) {
    console.log(`유튜브: 변경 없음 (영상 ${unique.length}개)`);
    return;
  }

  // 임시 파일에 먼저 쓰고 바꿔치기해서, 중간에 멈춰도 파일이 깨지지 않게 합니다.
  const data = { updatedAt: new Date().toISOString(), videos: unique };
  const temp = new URL("../data/youtube-videos.tmp.json", import.meta.url);
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temp, DATA_FILE);
  console.log(`유튜브: 영상 ${unique.length}개 저장 (채널 ${active.length}개)`);
}

main().catch((error) => {
  console.warn(`유튜브 영상 목록을 가져오지 못했습니다. 저장된 목록으로 계속합니다. (${error.message})`);
});