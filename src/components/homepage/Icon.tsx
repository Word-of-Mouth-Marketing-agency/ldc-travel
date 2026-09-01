type IconName =
  | "arrow"
  | "calendar"
  | "chat"
  | "chevron"
  | "compass"
  | "menu"
  | "close"
  | "pin"
  | "plane"
  | "quote"
  | "spark"
  | "support"
  | "star"
  | "globe";

const glyphs: Record<IconName, string> = {
  arrow: "↗",
  calendar: "▣",
  chat: "◌",
  chevron: "⌄",
  compass: "◈",
  menu: "≡",
  close: "×",
  pin: "●",
  plane: "⌁",
  quote: "“",
  spark: "✦",
  support: "◉",
  star: "★",
  globe: "◌",
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <span aria-hidden="true" className={`icon-glyph ${className}`}>
      {glyphs[name]}
    </span>
  );
}

export type { IconName };
