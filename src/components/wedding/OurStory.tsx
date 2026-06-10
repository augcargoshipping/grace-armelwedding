"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { COPY, WEDDING_IMAGES } from "@/lib/constants";

export function OurStory() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <section id="histoire" ref={ref} className="luxury-section">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-champagne/25 shadow-[0_20px_50px_rgba(28,26,24,0.1)]"
        >
          <Image
            src={WEDDING_IMAGES.story}
            alt="Grâce et Armel"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          <p className="font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.28em] text-purple-royal uppercase">
            Éditorial
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl text-ink md:text-5xl">
            {COPY.storyTitle}
          </h2>
          <div className="gold-line my-6 w-20" />
          <p className="font-[family-name:var(--font-playfair)] text-lg leading-relaxed text-ink-soft">
            {COPY.storyText}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
