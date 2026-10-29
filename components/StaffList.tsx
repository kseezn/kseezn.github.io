import type { Staff } from "@/data/staff";

// 사진이 없는 직원 자리에 넣는 대체 이미지: 은은한 남색 바탕 + 사람 모양 + 오른쪽 위 작은 로고 (사진과 같은 4:5 비율)
function StaffPlaceholder() {
  return (
    <svg className="staff-photo" viewBox="0 0 400 500" role="img" aria-label="사진 준비 중">
      <defs>
        <linearGradient id="staff-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef2f8" />
          <stop offset="1" stopColor="#d5deeb" />
        </linearGradient>
        <linearGradient id="staff-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa3c2" />
          <stop offset="1" stopColor="#6f86ab" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#staff-bg)" />
      {/* 머리와 어깨 */}
      <circle cx="200" cy="200" r="78" fill="url(#staff-body)" />
      <path d="M48 500c0-100 68-170 152-170s152 70 152 170z" fill="url(#staff-body)" />
      {/* 오른쪽 위 작은 현명 로고 */}
      <g transform="translate(270 30) scale(0.0346)" fill="none" stroke="#133160" strokeOpacity="0.35" strokeWidth="150" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2812.5 1428.5V472A409.5 409.5 0 0 0 2403 62.5H472A409.5 409.5 0 0 0 62.5 472V2403A409.5 409.5 0 0 0 472 2812.5H1428.5" />
        <rect x="1687.5" y="1687.5" width="1125" height="1125" rx="189.5" />
        <path d="M345.5 724H1469.5M907.5 345.5V724" />
        <circle cx="907.5" cy="1486.5" r="562" />
      </g>
    </svg>
  );
}

// 구성원 페이지용: 사무실별 직원 목록 (사진 + 이름 · 직책 · 이력)
// 사진(photo)이 없으면 대체 이미지를 보여 줍니다.
export function StaffList({ people }: { people: Staff[] }) {
  return (
    <div className="staff-block">
      <h3 className="staff-title">직원</h3>
      <ul className="staff-cards">
        {people.map((person) => (
          <li className="staff-card" key={`${person.name}-${person.role}`}>
            {person.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="staff-photo" src={person.photo} alt={`${person.name} ${person.role}`} loading="lazy" />
            ) : (
              <StaffPlaceholder />
            )}
            <div className="staff-body">
              <p className="staff-name">
                <strong>{person.name}</strong>
                <span>{person.role}</span>
              </p>
              {person.careers.length > 0 && (
                <ul className="staff-careers">
                  {person.careers.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}