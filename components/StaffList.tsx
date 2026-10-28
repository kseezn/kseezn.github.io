import type { Staff } from "@/data/staff";

// 구성원 페이지용: 사무실별 직원 목록 (사진 없이 이름 · 직책 · 이력)
export function StaffList({ people }: { people: Staff[] }) {
  return (
    <div className="staff-block">
      <h3 className="staff-title">직원</h3>
      <ul className="staff-cards">
        {people.map((person) => (
          <li className="staff-card" key={`${person.name}-${person.role}`}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}