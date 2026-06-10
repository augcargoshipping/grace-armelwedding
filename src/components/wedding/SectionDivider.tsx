"use client";

import { motion, useReducedMotion } from "framer-motion";

type SectionDividerProps = {
  variant?: "simple" | "floral";
};

function FloralSvg() {
  return (
    <svg
      viewBox="0 0 640 48"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 24h220"
        stroke="url(#floral-gold)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M400 24h220"
        stroke="url(#floral-gold)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M320 24c-8-10-18-14-28-10s-16 14-8 22 20 6 28-2 8-18 0-10-8-10z"
        fill="rgba(26,122,98,0.18)"
        stroke="#1a7a62"
        strokeWidth="0.8"
      />
      <path
        d="M292 26c-6-8-4-16 2-18 6-2 12 4 10 12-2 8-10 10-12 6z"
        fill="rgba(201,169,98,0.2)"
        stroke="#c9a962"
        strokeWidth="0.7"
      />
      <path
        d="M348 26c6-8 4-16-2-18-6-2-12 4-10 12 2 8 10 10 12 6z"
        fill="rgba(201,169,98,0.2)"
        stroke="#c9a962"
        strokeWidth="0.7"
      />
      <circle cx="320" cy="24" r="3.5" fill="#d4af37" opacity="0.9" />
      <path
        d="M320 14v-4M320 38v-4M310 24h-4M334 24h-4"
        stroke="#d4af37"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <defs>
        <linearGradient id="floral-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor="#e8d5a3" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="80%" stopColor="#e8d5a3" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SectionDivider({ variant = "simple" }: SectionDividerProps) {
  const reducedMotion = useReducedMotion() ?? false;

  if (variant === "floral") {
    return (
      <div className="section-divider-floral relative w-full py-4 md:py-6" aria-hidden="true">
        <motion.div
          className="mx-auto h-10 w-full max-w-xl md:h-12"
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <FloralSvg />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-5 md:py-7">
      <motion.div
        className="gold-line w-32 md:w-48"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
