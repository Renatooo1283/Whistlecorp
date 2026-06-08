"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/content/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { ServicesDropdown } from "./ServicesDropdown";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled
          ? "border-b border-slate-200 bg-white/95 backdrop-blur"
          : "border-b border-transparent bg-white"
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-[72px]">
        <Logo tone="light" />

        <nav className="hidden md:block" aria-label="Principal">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href) && !item.children);
              if (item.children) {
                return (
                  <li key={`${item.label}-${item.href}`}>
                    <ServicesDropdown
                      label={item.label}
                      href={item.href}
                      items={item.children}
                    />
                  </li>
                );
              }
              return (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Button href="/contacto" variant="primary" size="md">
              Solicitar diagnóstico
            </Button>
          </div>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
