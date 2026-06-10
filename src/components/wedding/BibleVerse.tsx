"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COPY } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export function BibleVerse() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".verse-line", {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="verset" ref={ref} className="luxury-section">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-[1.5rem] px-8 py-12 md:px-12 md:py-14"
        >
          <p className="verse-line whitespace-pre-line font-[family-name:var(--font-playfair)] text-2xl leading-relaxed text-ink md:text-3xl">
            {COPY.bibleVerse}
          </p>
          <p className="verse-line mt-6 font-[family-name:var(--font-cormorant)] text-lg tracking-[0.2em] text-emerald uppercase">
            {COPY.bibleRef}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
