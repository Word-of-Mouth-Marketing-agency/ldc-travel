import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Compass,
  Globe2,
  Leaf,
  Mail,
  MessageCircle,
  MapPin,
  Menu,
  Moon,
  Mountain,
  Quote,
  Sparkles,
  Star,
  Utensils,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";

type IconName =
  | "arrow"
  | "arrow-up-right"
  | "city"
  | "check"
  | "chevron"
  | "compass"
  | "close"
  | "globe"
  | "leaf"
  | "mail"
  | "message"
  | "menu"
  | "moon"
  | "mountain"
  | "pin"
  | "quote"
  | "sparkles"
  | "star"
  | "utensils"
  | "waves";

const icons: Record<IconName, LucideIcon> = {
  arrow: ArrowRight,
  "arrow-up-right": ArrowUpRight,
  city: Building2,
  check: CheckCircle2,
  chevron: ChevronDown,
  compass: Compass,
  close: X,
  globe: Globe2,
  leaf: Leaf,
  mail: Mail,
  message: MessageCircle,
  menu: Menu,
  moon: Moon,
  mountain: Mountain,
  pin: MapPin,
  quote: Quote,
  sparkles: Sparkles,
  star: Star,
  utensils: Utensils,
  waves: Waves,
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
