"use client";

import { Children } from "react";
import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 90, damping: 22 } as const;

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function UseCaseGroupAnimated({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  const items = Children.toArray(children);

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ ...SPRING }}
        className="lg:sticky lg:top-28 lg:self-start"
      >
        <p className="font-mono text-xs font-medium tracking-wider text-[var(--color-accent-hover)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-[var(--color-text-strong)] sm:text-3xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text)]">
          {description}
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
        }}
        className="grid gap-5 sm:grid-cols-2"
      >
        {items.map((child, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: SPRING },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
