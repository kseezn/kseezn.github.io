// 블로그 글 목록(data/blog-posts.json)을 분류별로 꺼내 주는 함수들입니다.
import data from "@/data/blog-posts.json";

export type BlogSection = "insights" | "news" | "hrnews";

export type BlogPost = {
  id: string;
  title: string;
  displayTitle: string;
  excerpt: string;
  date: string;
  url: string;
  image: string;
  tags: string[];
  section: BlogSection;
  hidden: boolean;
};

const allPosts = (data.posts as BlogPost[]).filter((post) => !post.hidden);

export function getPosts(section: BlogSection, limit?: number): BlogPost[] {
  const list = allPosts.filter((post) => post.section === section);
  return limit ? list.slice(0, limit) : list;
}