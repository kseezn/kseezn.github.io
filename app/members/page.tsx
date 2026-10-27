import type { Metadata } from "next";
import { ContactBand, MemberGrid, PageHero } from "@/components/Common";
import { members } from "@/data/site";

export const metadata: Metadata = { title: "구성원" };

export default function MembersPage() {
  return (
    <>
      <PageHero title="구성원" description="노무법인 현명을 소개합니다." />
      <section className="section">
        <div className="container">
          {members.length > 0 ? (
            <MemberGrid />
          ) : (
            <p className="empty">구성원 소개를 준비하고 있습니다. 현명의 소식은 공식 블로그에서 확인하실 수 있습니다.</p>
          )}
        </div>
      </section>
      <ContactBand />
    </>
  );
}