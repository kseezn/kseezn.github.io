// 언론 보도 목록을 만들어 주는 함수입니다.
// - data/press-articles.json: GitHub가 3시간마다 네이버 뉴스에서 자동으로 모으는 기사 (직접 고치지 않음)
// - data/press-overrides.json: 직접 고치는 파일
//     show   : 후보 기사 중 게시할 기사 번호(id)
//     hide   : 게시된 기사 중 숨길 기사 번호(id)
//     manual : 직접 추가하는 기사 { "title", "source", "date": "2025-03-01", "url" }
import articlesData from "@/data/press-articles.json";
import overrides from "@/data/press-overrides.json";

export type PressArticle = {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  matched?: string[];
  status?: "shown" | "pending";
};

type ManualArticle = { title: string; source?: string; date: string; url: string };

const autoArticles = articlesData.articles as PressArticle[];
const show = new Set<string>(overrides.show as string[]);
const hide = new Set<string>(overrides.hide as string[]);

const manualArticles: PressArticle[] = (overrides.manual as ManualArticle[]).map((item, index) => ({
  id: `manual-${index}`,
  title: item.title,
  source: item.source ?? "",
  date: item.date,
  url: item.url,
}));

const byDate = (a: PressArticle, b: PressArticle) => b.date.localeCompare(a.date);

// 언론 보도 페이지에 보이는 기사
export function getPressArticles(): PressArticle[] {
  const auto = autoArticles.filter(
    (article) => !hide.has(article.id) && (article.status === "shown" || show.has(article.id)),
  );
  return [...auto, ...manualArticles].sort(byDate);
}

// 아직 게시하지 않은 후보 기사 (노무사 이름으로만 찾은 기사)
export function getPressCandidates(): PressArticle[] {
  return autoArticles
    .filter((article) => article.status === "pending" && !show.has(article.id) && !hide.has(article.id))
    .sort(byDate);
}