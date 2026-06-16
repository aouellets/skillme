export function VerifiedMark({ label = true }: { label?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-success"
      title="Verified by SkillShelf"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 1.5l1.6 1.2 2 .1.6 1.9 1.6 1.2-.6 1.9.6 1.9-1.6 1.2-.6 1.9-2 .1L8 14.5l-1.6-1.2-2-.1-.6-1.9L2.2 9.9l.6-1.9-.6-1.9 1.6-1.2.6-1.9 2-.1L8 1.5z"
          fill="currentColor"
          opacity="0.18"
        />
        <path
          d="M5.5 8.2l1.7 1.7L10.7 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label && <span>Verified</span>}
    </span>
  )
}
