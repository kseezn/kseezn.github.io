// 예전 홈페이지(아임웹)에 올려 둔 고객사 로고, 수상·위촉장, 첫 화면 사진을 한 번에 내려받습니다.
// 사용법: 프로젝트 폴더의 터미널에서  node scripts/download-old-images.mjs
// 받은 파일은 public/clients, public/awards, public/hero 폴더에 저장됩니다. 이미 있는 파일은 건너뜁니다.

import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const THUMB = "https://cdn.imweb.me/thumbnail/";
const UPLOAD = "https://cdn.imweb.me/upload/S20250226f6bd74a13e09a/";

// [저장할 파일, 예전 홈페이지의 이미지 주소]
const files = [
  // 고객사 로고 32개 (data/clients.ts의 순서와 같음)
  ["public/clients/01.jpg", THUMB + "20250828/6a226e73df687.jpg"],
  ["public/clients/02.jpg", THUMB + "20250828/0ea5ec25258ec.jpg"],
  ["public/clients/03.jpg", THUMB + "20250926/b7ebc46dbf9d3.jpg"],
  ["public/clients/04.jpg", THUMB + "20250828/934d9ae933226.jpg"],
  ["public/clients/05.jpg", THUMB + "20250828/2c4d657e175c5.jpg"],
  ["public/clients/06.jpg", THUMB + "20250828/6ae071f168d75.jpg"],
  ["public/clients/07.jpg", THUMB + "20250828/061b54599883e.jpg"],
  ["public/clients/08.jpg", THUMB + "20250828/fb77ceaa6765f.jpg"],
  ["public/clients/09.jpg", THUMB + "20250828/045af21c7a174.jpg"],
  ["public/clients/10.jpg", THUMB + "20250828/41f0a5ef31944.jpg"],
  ["public/clients/11.jpg", THUMB + "20250828/080ac0dc66fe6.jpg"],
  ["public/clients/12.jpg", THUMB + "20250828/f56cd0453eada.jpg"],
  ["public/clients/13.jpg", THUMB + "20250828/957d6ae396138.jpg"],
  ["public/clients/14.jpg", THUMB + "20250828/eaaa4c700f051.jpg"],
  ["public/clients/15.jpg", THUMB + "20250828/cfa7fd6ff70fd.jpg"],
  ["public/clients/16.jpg", THUMB + "20250828/064fdfa68d9d1.jpg"],
  ["public/clients/17.jpg", THUMB + "20250828/2e96eebc1fb09.jpg"],
  ["public/clients/18.jpg", THUMB + "20250828/3997a930758a9.jpg"],
  ["public/clients/19.jpg", THUMB + "20250828/dc8ff18fa355e.jpg"],
  ["public/clients/20.jpg", THUMB + "20250828/b4231441193d5.jpg"],
  ["public/clients/21.jpg", THUMB + "20250828/ba520709ae3d3.jpg"],
  ["public/clients/22.jpg", THUMB + "20250828/5a283063d488f.jpg"],
  ["public/clients/23.jpg", THUMB + "20250828/11752d309f70f.jpg"],
  ["public/clients/24.jpg", THUMB + "20250828/8cc2cffdddaee.jpg"],
  ["public/clients/25.jpg", THUMB + "20250828/e8b8299f695b3.jpg"],
  ["public/clients/26.png", UPLOAD + "c009c51adcc9e.png"],
  ["public/clients/27.png", UPLOAD + "7a1a6b647ae41.png"],
  ["public/clients/28.png", UPLOAD + "27acbc08f8d47.png"],
  ["public/clients/29.png", UPLOAD + "dbc542b7a8068.png"],
  ["public/clients/30.png", UPLOAD + "95a303cdcd9e3.png"],
  ["public/clients/31.png", UPLOAD + "cb27657079dc1.png"],
  ["public/clients/32.png", UPLOAD + "45e8a7b478d49.png"],

  // 수상·위촉장 18개
  ["public/awards/01.png", THUMB + "20260128/e2b597f516c5c.png"],
  ["public/awards/02.png", THUMB + "20260128/80c2cf0098bfc.png"],
  ["public/awards/03.png", THUMB + "20260128/126b4ea2e764a.png"],
  ["public/awards/04.png", THUMB + "20260128/e26f3ba98eb9f.png"],
  ["public/awards/05.jpg", THUMB + "20250828/f960d29d5a2f9.jpg"],
  ["public/awards/06.jpg", THUMB + "20250828/dba4421dbb823.jpg"],
  ["public/awards/07.jpg", THUMB + "20250828/e209043d38aa2.jpg"],
  ["public/awards/08.jpg", THUMB + "20250828/53f2908ed7684.jpg"],
  ["public/awards/09.jpg", THUMB + "20250828/17ada45f506f5.jpg"],
  ["public/awards/10.jpg", THUMB + "20250828/64ac7b7f10603.jpg"],
  ["public/awards/11.jpg", THUMB + "20250828/4d5f85ed360a5.jpg"],
  ["public/awards/12.jpg", THUMB + "20250828/00cd16eea66b2.jpg"],
  ["public/awards/13.jpg", THUMB + "20250828/bc72e7e8df7ee.jpg"],
  ["public/awards/14.jpg", THUMB + "20250828/07fee2f575d65.jpg"],
  ["public/awards/15.jpg", THUMB + "20250828/4ef1d8157194b.jpg"],
  ["public/awards/16.jpg", THUMB + "20250828/c56a63ce5566e.jpg"],
  ["public/awards/17.jpg", THUMB + "20250828/ffc6cc78af4d1.jpg"],
  ["public/awards/18.jpg", THUMB + "20250828/ba0325fe80df3.jpg"],

  // 메인 첫 화면 배경 사진 3장
  ["public/hero/01.jpg", THUMB + "20250806/7945dc19666d3.jpg"],
  ["public/hero/02.jpg", THUMB + "20250806/847e0d59ab823.jpg"],
  ["public/hero/03.jpg", THUMB + "20250805/43e09385e667a.jpg"],
];

let saved = 0;
let skipped = 0;
const failed = [];

for (const [file, url] of files) {
  try {
    await access(file);
    skipped += 1; // 이미 있음
    continue;
  } catch {
    // 없으면 내려받습니다.
  }
  try {
    // 예전 홈페이지에서 여는 것과 같은 정보를 함께 보냅니다. (그림 서버가 막지 않도록)
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.yeshm.co.kr/" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, Buffer.from(await response.arrayBuffer()));
    saved += 1;
    console.log("저장:", file);
  } catch (error) {
    failed.push(file);
    console.error("실패:", file, "-", error.message);
  }
}

console.log(`\n새로 저장 ${saved}개, 이미 있어서 건너뜀 ${skipped}개, 실패 ${failed.length}개`);
if (failed.length > 0) {
  console.log("실패한 파일이 있으면 잠시 뒤 같은 명령을 한 번 더 실행해 보세요.");
  process.exitCode = 1;
}