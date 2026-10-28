"use client"; // 사진을 불러오지 못했을 때 로고로 바꾸기 위해 브라우저에서 실행됩니다.

import Link from "next/link";
import { useState } from "react";
import LogoMark from "@/components/LogoMark";
import type { Member } from "@/data/members";

// 구성원 사진. 파일이 없거나 불러오지 못하면 로고를 대신 보여 줍니다.
export function MemberPhoto({ member, className = "" }: { member: Member; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (!member.photo || broken) {
    return (
      <div className={`member-photo member-photo-empty ${className}`} aria-hidden="true">
        <LogoMark size={56} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`member-photo ${className}`}
      src={member.photo}
      alt={`${member.name} ${member.role}`}
      width={640}
      height={800}
      loading="lazy"
      onError={() => setBroken(true)}
      // 페이지가 준비되기 전에 이미 실패한 사진도 찾아서 로고로 바꿉니다.
      ref={(img) => {
        if (img?.complete && img.naturalWidth === 0) setBroken(true);
      }}
    />
  );
}

// "現) 노무법인 현명 대표노무사" → 표시("現")와 내용("노무법인 현명 대표노무사")으로 나눕니다.
function splitMark(line: string) {
  const match = line.match(/^(現|前)\)\s*(.*)$/);
  return match ? { mark: match[1], text: match[2] } : { mark: "", text: line };
}

// 메인 화면용: 사진 + 이름 카드 (누르면 구성원 페이지의 그 사람 소개로 이동)
export function MemberCards({ members }: { members: Member[] }) {
  return (
    <ul className="member-cards">
      {members.map((member) => (
        <li key={member.id}>
          <Link href={`/members/#${member.id}`} className="member-card-link">
            <MemberPhoto member={member} />
            <span className="member-card-role">{member.role}</span>
            <strong>{member.name}</strong>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// 구성원 페이지용: 사진 + 상세 이력
export function MemberProfile({ member }: { member: Member }) {
  return (
    <article className="member-profile" id={member.id}>
      <div className="member-profile-photo">
        <MemberPhoto member={member} />
      </div>
      <div className="member-profile-body">
        <p className="member-profile-role">{member.role}</p>
        <h3 className="member-profile-name">{member.name}</h3>
        {member.intro && <p className="member-profile-intro">{member.intro}</p>}

        {member.highlights.length > 0 && (
          <ul className="member-highlights">
            {member.highlights.map((line) => {
              const { mark, text } = splitMark(line);
              return (
                <li key={line}>
                  {mark && <span className={mark === "前" ? "mark mark-past" : "mark"}>{mark}</span>}
                  {text}
                </li>
              );
            })}
          </ul>
        )}

        {member.sections.length > 0 && (
          <div className="member-sections">
            {member.sections.map((section) => (
              <section
                key={section.title}
                className={section.compact ? "member-section is-compact" : "member-section"}
              >
                <h4>{section.title}</h4>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}