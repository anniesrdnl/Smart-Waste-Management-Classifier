import { Cylinder, Milk, Newspaper, Package, Trash2, Wine, type LucideIcon } from "lucide-react";
import type { WasteClassId } from "@/lib/classes";

const ICONS: Record<WasteClassId, LucideIcon> = {
  cardboard: Package,
  glass: Wine,
  metal: Cylinder,
  paper: Newspaper,
  plastic: Milk,
  trash: Trash2,
};

interface CategoryIconProps {
  classId: WasteClassId;
  className?: string;
}

export default function CategoryIcon({ classId, className }: CategoryIconProps) {
  const Icon = ICONS[classId];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
