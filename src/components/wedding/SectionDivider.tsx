"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { WEDDING_IMAGES } from "@/lib/constants";

type SectionDividerProps = {
  variant?: "simple" | "floral";
};

export function SectionDivider({ variant = "simple" }: SectionDividerProps) {
  const reducedMotion = useReducedMotion() ?? false;

  if (variant === "floral") {
    return (
      <div className="section-divider-floral relative w-full -my-8 py-1 md:-my-12 md:py-2" aria-hidden="true">
        <motion.div
          className="section-divider-floral-frame relative mx-auto w-full max-md:max-w-none md:max-w-6xl"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="section-divider-floral-image w-full"
            animate={reducedMotion ? undefined : { y: [0, -2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={WEDDING_IMAGES.floralDivider}
              alt=""
              width={1200}
              height={120}
              sizes="100vw"
              quality={90}
              className="h-auto w-full"
              priority={false}
            />
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
