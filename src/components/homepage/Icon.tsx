import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Plane,
  Quote,
  Star,
  X,
  type LucideIcon,
} from "lucide-react";

type IconName =
  | "arrow"
  | "calendar"
  | "chevron"
  | "clock"
  | "close"
  | "mail"
  | "menu"
  | "pin"
  | "plane"
  | "quote"
  | "star";

const icons: Record<IconName, LucideIcon> = {
  arrow: ArrowRight,
  calendar: CalendarDays,
  chevron: ChevronDown,
  clock: Clock3,
  close: X,
  mail: Mail,
  menu: Menu,
  pin: MapPin,
  plane: Plane,
  quote: Quote,
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
