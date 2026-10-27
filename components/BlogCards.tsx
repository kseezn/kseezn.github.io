"use client"; // 검색, 더 보기, 이미지 실패 처리 때문에 브라우저에서 실행됩니다.

import { useState } from "react";
import LogoMark from "@/components/LogoMark";
import type { BlogPost } from "@/lib/blog";
import { sectionLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";

const PAGE_SIZE = 12;

// 블로그 썸네일. 이미지가 없거나 불러오지 못하면 로고를 대신 보여 줍니다.
function Thumbnail({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className="blog-image blog-image-empty" aria-hidden="true">
        <LogoMark size={44} />
      </div>
    );
  }
  return (
    // 정적 사이트에서는 외부 이미지 최적화(next/image)를 쓸 수 없어서 img 태그를 씁니다.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="blog-image"
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
    />
  );
}

// 블로그 글 카드 묶음. images={false}면 메인처럼 글자만 있는 카드로 보여 줍니다.
export function BlogCards({ posts, images = true }: { posts: BlogPost[]; images?: boolean }) {
  if (posts.length === 0) {
    return <p className="empty">현재 표시할 글이 없습니다. 공식 블로그에서도 소식을 확인하실 수 있습니다.</p>;
  }
  return (
    <div className="blog-grid">
      {posts.map((post) => (
        <a className="blog-card" href={post.url} key={post.id} target="_blank" rel="noopener noreferrer">
          {images && <Thumbnail src={post.image} />}
          <div className="blog-body">
            <span className="tag">{sectionLabels[post.section]}</span>
            <h3>{post.displayTitle}</h3>
            <p>{post.excerpt}</p>
            <div className="blog-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>블로그에서 읽기 ↗</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

// 검색창 + 카드 + 더 보기 버튼 (인사이트, 법인 소식, HR뉴스 페이지)
export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(PAGE_SIZE);

  const keyword = query.trim().toLowerCase();
  const filtered = keyword
    ? posts.filter((post) => `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase().includes(keyword))
    : posts;

  return (
    <>
      <div className="search">
        <label htmlFor="post-search">게시글 검색</label>
        <input
          id="post-search"
          type="search"
          placeholder="제목 또는 키워드를 입력하세요"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setCount(PAGE_SIZE);
          }}
        />
        <span aria-live="polite">{filtered.length}개의 글</span>
      </div>

      {posts.length > 0 && filtered.length === 0 ? (
        <p className="empty">‘{query.trim()}’에 맞는 글이 없습니다. 다른 단어로 검색해 보세요.</p>
      ) : (
        <BlogCards posts={filtered.slice(0, count)} />
      )}

      {filtered.length > count && (
        <div className="center">
          <button type="button" className="button button-outline" onClick={() => setCount(count + PAGE_SIZE)}>
            더 보기
          </button>
        </div>
      )}
    </>
  );
}