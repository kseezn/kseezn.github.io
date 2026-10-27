// 노무법인 현명 로고 (원본 이미지를 선으로 옮긴 것)
// 색은 감싸는 글자색(currentColor)을 따라가서, 흰 배경에서는 남색, 남색 배경에서는 흰색으로 쓸 수 있습니다.
export default function LogoMark({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 2875 2875"
      fill="none"
      stroke="currentColor"
      strokeWidth="125"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2812.5 1428.5V472A409.5 409.5 0 0 0 2403 62.5H472A409.5 409.5 0 0 0 62.5 472V2403A409.5 409.5 0 0 0 472 2812.5H1428.5" />
      <rect x="1687.5" y="1687.5" width="1125" height="1125" rx="189.5" />
      <path d="M345.5 724H1469.5M907.5 345.5V724" />
      <circle cx="907.5" cy="1486.5" r="562" />
    </svg>
  );
}