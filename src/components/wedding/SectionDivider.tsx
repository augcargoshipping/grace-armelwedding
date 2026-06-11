"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WEDDING_IMAGES } from "@/lib/constants";

type SectionDividerProps = {
  variant?: "simple" | "floral";
};

export function SectionDivider({ variant = "simple" }: SectionDividerProps) {
  const reducedMotion = useReducedMotion() ?? false;

  if (variant === "floral") {
    return (
      <div className="section-divider-floral relative w-full -my-10 py-0 md:-my-14" aria-hidden="true">
        <motion.div
          className="section-divider-bar mx-auto w-full max-w-4xl px-6 md:max-w-5xl md:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-24px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="section-divider-bar-track relative h-4 overflow-hidden rounded-full md:h-5"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-24px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center center" }}
          >
            <div
              className="section-divider-floral-crop absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${WEDDING_IMAGES.floralDivider}')` }}
            />

            <span className="section-divider-bar-line pointer-events-none absolute inset-0" aria-hidden="true" />

            {!reducedMotion ? (
              <span className="section-divider-shimmer section-divider-shimmer-animate" aria-hidden="true" />
            ) : null}
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
