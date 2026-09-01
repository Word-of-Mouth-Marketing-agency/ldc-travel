type SocialIconProps = { label: string };

export function SocialIcon({ label }: SocialIconProps) {
  const commonProps = {
    "aria-hidden": true,
    className: "social-icon",
    focusable: "false",
    viewBox: "0 0 24 24",
  } as const;

  switch (label.toLowerCase()) {
    case "instagram":
      return (
        <svg {...commonProps} className="social-icon social-icon-outline">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.018 4.388 11.006 10.125 11.927v-8.432H7.078v-3.495h3.047V9.41c0-3.017 1.791-4.687 4.533-4.687 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.93-1.956 1.887v2.275h3.328l-.532 3.495h-2.796V24C19.612 23.079 24 18.091 24 12.073Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.29 1.76-.15.34-.11.72-.1 1.08.15 1.45 1.39 2.69 2.84 2.85.99.1 2.01-.18 2.68-.87.68-.71.94-1.69.95-2.65.04-4.75-.02-9.5.02-14.25Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3ZM20.44 13.41c0-3.47-1.85-5.09-4.32-5.09-1.99 0-2.88 1.1-3.38 1.87V8.5H9.45V20h3.29v-5.69c0-1.5.28-2.96 2.15-2.96 1.84 0 1.87 1.72 1.87 3.06V20h3.29l.39-6.59Z" />
        </svg>
      );
    default:
      return null;
  }
}
