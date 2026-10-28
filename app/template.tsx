import type { ReactNode } from "react";

// 페이지를 옮길 때마다 새로 그려지는 틀입니다.
// 본문을 감싸서, 다른 페이지로 넘어갈 때 내용이 부드럽게 떠오르며 나타나게 합니다. (모양은 globals.css의 .page-enter)
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}