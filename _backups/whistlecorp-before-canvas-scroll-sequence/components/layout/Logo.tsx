import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-7",
  md: "h-9",
  lg: "h-11",
};

export function Logo({ className, tone = "light", size = "md" }: Props) {
  const isDark = tone === "dark";

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="WhistleCorp — Inicio"
    >
      <Image
        src="/imagenes/Logo.png"
        alt="WhistleCorp"
        width={300}
        height={100}
        priority
        sizes="(min-width: 768px) 220px, 160px"
        className={cn(
          sizeMap[size],
          "w-auto object-contain",
          isDark && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        )}
      />
    </Link>
  );
}
