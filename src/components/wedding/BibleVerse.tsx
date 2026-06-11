"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { COPY } from "@/lib/constants";

const ease = [0.22, 1, 0.36, 1] as const;

export function BibleVerse() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section id="verset" ref={ref} className="luxury-section">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="glass-card rounded-[1.5rem] px-8 py-12 md:px-12 md:py-14"
        >
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.05 }}
            className="whitespace-pre-line font-[family-name:var(--font-playfair)] text-2xl leading-relaxed text-ink md:text-3xl"
          >
            {COPY.bibleVerse}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.18 }}
            className="mt-6 font-[family-name:var(--font-cormorant)] text-lg tracking-[0.2em] text-emerald uppercase"
          >
            {COPY.bibleRef}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
