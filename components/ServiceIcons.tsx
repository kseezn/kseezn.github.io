// 업무분야 선 아이콘 (로고와 같은 둥근 선 스타일). slug마다 하나씩, 없으면 둥근 사각형.
export function ServiceIcon({ slug, size = 28 }: { slug: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (slug) {
    case "hr-advisory": // 말풍선 + 체크
      return (
        <svg {...common}>
          <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <path d="M8.5 10.5l2.5 2.5 4.5-5" />
        </svg>
      );
    case "payroll": // 명세서
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="3" />
          <path d="M9 8h6M9 12h6M9 16h3" />
        </svg>
      );
    case "labor-relations": // 마주 보는 두 사람
      return (
        <svg {...common}>
          <circle cx="7" cy="8" r="2.5" />
          <circle cx="17" cy="8" r="2.5" />
          <path d="M3 19a4 4 0 0 1 8 0M13 19a4 4 0 0 1 8 0M10 13.5h4" />
        </svg>
      );
    case "labor-inspection": // 점검표
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="3" />
          <path d="M9 4V3h6v1M8.5 12l2 2 4-4.5M9 17.5h6" />
        </svg>
      );
    case "hr-consulting": // 조직도
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="5" rx="1.5" />
          <rect x="3" y="16" width="6" height="5" rx="1.5" />
          <rect x="15" y="16" width="6" height="5" rx="1.5" />
          <path d="M12 8v4M6 16v-4h12v4" />
        </svg>
      );
    case "subsidy": // 동전 (₩)
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M7.5 8.5l2 7 2.5-5.5 2.5 5.5 2-7M7 12h10" />
        </svg>
      );
    case "education": // 펼친 책
      return (
        <svg {...common}>
          <path d="M3 5.5c3-1.5 6-1.5 9 1 3-2.5 6-2.5 9-1V19c-3-1.5-6-1.5-9 1-3-2.5-6-2.5-9-1z" />
          <path d="M12 6.5V20" />
        </svg>
      );
    case "case-representation": // 저울
      return (
        <svg {...common}>
          <path d="M12 4v16M8 20h8M5 7h14M12 4.5l-7 2.5M12 4.5l7 2.5" />
          <path d="M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z" />
        </svg>
      );
    case "workplace-harassment": // 사람 + 말풍선
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
          <rect x="14" y="4" width="7" height="6" rx="2" />
          <path d="M16 12l1.5-2" />
        </svg>
      );
    case "sanjae-center": // 둥근 사각형 안의 십자
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M12 8.5v7M8.5 12h7" />
        </svg>
      );
    case "industrial-safety": // 안전모
      return (
        <svg {...common}>
          <path d="M4 17h16M6 17v-2a6 6 0 0 1 12 0v2M10 9.5V7h4v2.5" />
          <rect x="3" y="17" width="18" height="3" rx="1.5" />
        </svg>
      );
    case "risk-assessment": // 경고 삼각형
      return (
        <svg {...common}>
          <path d="M10.3 4.5a2 2 0 0 1 3.4 0l7.4 12.8a2 2 0 0 1-1.7 3H4.6a2 2 0 0 1-1.7-3z" />
          <path d="M12 9.5v4M12 16.8v.01" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
        </svg>
      );
  }
}