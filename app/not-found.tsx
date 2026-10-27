import Link from "next/link";
import LogoMark from "@/components/LogoMark";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <LogoMark size={56} />
        <h1>페이지를 찾을 수 없습니다.</h1>
        <p>주소를 확인하거나 홈으로 이동해 주세요.</p>
        <Link className="button button-navy" href="/">
          홈으로
        </Link>
      </div>
    </section>
  );
}