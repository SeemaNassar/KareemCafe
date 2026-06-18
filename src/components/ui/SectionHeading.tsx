"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className = "",
}: Props) {
  const alignClass =
    align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold-gradient" />
          <span className="text-xs uppercase tracking-[0.4em] text-gold">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-gold-gradient" />
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream leading-[1.05]">
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
