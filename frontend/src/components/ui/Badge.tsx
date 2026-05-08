import { getCategoryColor } from "@/lib/utils";
import type { Category } from "@/types";

interface BadgeProps {
  category: Category;
  size?: "sm" | "md";
}

export default function Badge({ category, size = "sm" }: BadgeProps) {
  const color = getCategoryColor(category);
  const padding = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-block rounded font-semibold uppercase tracking-wide ${color} ${padding}`}
    >
      {category}
    </span>
  );
}
