import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, PageHero } from "@/components/Common";
import { MemberProfile } from "@/components/Members";
import { StaffList } from "@/components/StaffList";
import { members } from "@/data/members";
import { offices } from "@/data/site";
import { staff } from "@/data/staff";

export const metadata: Metadata = { title: "구성원" };

export default function MembersPage() {
  // 사무실 순서대로 노무사와 직원을 묶습니다. (아무도 없는 사무실은 건너뜀)
  const groups = offices
    .map((office) => ({
      office,
      people: members.filter((member) => member.office === office.id),
      crew: staff.filter((person) => person.office === office.id),
    }))
    .filter((group) => group.people.length + group.crew.length > 0);

  return (
    <>
      <PageHero
        title="구성원"
        description="현명한 노무 전문팀과 신뢰할 수 있는 전문가 협업 시스템으로 함께합니다."
      />

      {/* 사무실 바로가기 */}
      <nav className="office-jump" aria-label="사무실별 구성원 바로가기">
        <div className="container office-jump-inner">
          {groups.map(({ office }) => (
            <a key={office.id} href={`#office-${office.id}`}>
              {office.name}
            </a>
          ))}
        </div>
      </nav>

      {groups.map(({ office, people, crew }, index) => (
        <section
          key={office.id}
          id={`office-${office.id}`}
          className={index % 2 === 1 ? "section section-muted member-office" : "section member-office"}
        >
          <div className="container">
            <header className="member-office-head">
              <h2>{office.name}</h2>
              <p>
                {office.address} {office.detail}
                <Link href={`/location/#${office.id}`}>오시는 길 →</Link>
              </p>
            </header>
            {people.length > 0 && (
              <div className="member-profiles">
                {people.map((member) => (
                  <MemberProfile member={member} key={member.id} />
                ))}
              </div>
            )}
            {crew.length > 0 && <StaffList people={crew} />}
          </div>
        </section>
      ))}

      <ContactBand />
    </>
  );
}