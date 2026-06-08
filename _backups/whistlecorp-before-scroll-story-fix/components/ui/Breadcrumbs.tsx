import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

type Props = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumbs({ items, className }: Props) {
  return (
    <nav aria-label="Migas de pan" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-white/70">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-white" : ""}>{item.label}</span>
              )}
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
