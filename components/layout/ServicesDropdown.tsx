"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/lib/content/navigation";

type Props = {
  label: string;
  href: string;
  items: NavLink[];
};

export function ServicesDropdown({ label, href, items }: Props) {
  const pathname = usePathname();

  const isActive =
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={false}
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium transition-colors",
          isActive
            ? "text-slate-900"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        {label}
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
          aria-hidden
        />
      </button>

      {/* Panel: pt-3 keeps a visible gap without a dead hover zone.
          Visibility is driven purely by CSS hover/focus-within on the
          parent .group — no useState, no timers, no listeners. */}
      <div
        role="menu"
        className={cn(
          "absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3",
          "invisible opacity-0 transition-opacity duration-150",
          "group-hover:visible group-hover:opacity-100",
          "group-focus-within:visible group-focus-within:opacity-100"
        )}
      >
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-[0_12px_32px_rgba(11,27,43,0.12)]">
          <Link
            href={href}
            role="menuitem"
            className={cn(
              "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              pathname === href
                ? "bg-slate-100 text-slate-900"
                : "text-slate-900 hover:bg-slate-100"
            )}
          >
            {label}
          </Link>
          <div className="my-1 h-px bg-slate-100" />
          {items.map((item) => {
            const itemActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                  itemActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
