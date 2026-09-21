import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  Globe2,
  Mail,
  MessageCircle,
  MapPin,
  Menu,
  Quote,
  Sparkles,
  Star,
  X,
  type LucideIcon,
} from "lucide-react";

type IconName =
  | "arrow"
  | "arrow-up-right"
  | "check"
  | "chevron"
  | "compass"
  | "close"
  | "globe"
  | "mail"
  | "message"
  | "menu"
  | "pin"
  | "quote"
  | "sparkles"
  | "star";

const icons: Record<IconName, LucideIcon> = {
  arrow: ArrowRight,
  "arrow-up-right": ArrowUpRight,
  check: CheckCircle2,
  chevron: ChevronDown,
  compass: Compass,
  close: X,
  globe: Globe2,
  mail: Mail,
  message: MessageCircle,
  menu: Menu,
  pin: MapPin,
  quote: Quote,
  sparkles: Sparkles,
  star: Star,
};

export function Icon({
  name,
  className = "",
  size = 18,
  strokeWidth = 1.8,
}: {
  name: IconName;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const IconComponent = icons[name];

  return (
    <IconComponent
      aria-hidden="true"
      className={`ui-icon ${className}`.trim()}
      focusable="false"
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}

export type { IconName };
