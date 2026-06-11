"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { COPY } from "@/lib/constants";
import { GallerySlideshow } from "./GallerySlideshow";

const slideEase = [0.22, 1, 0.36, 1] as const;

function GalleryHeader({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="mb-10 text-center"
    >
      <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-ink md:text-5xl">
        {COPY.galleryTitle}
      </h2>
      <p className="mt-3 font-[family-name:var(--font-playfair)] text-lg italic text-ink-soft">
        {COPY.gallerySubtitle}
      </p>
      <div className="gold-line mx-auto my-6 w-24" />
    </motion.div>
  );
}

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8% 0px" });
  const isActive = useInView(sectionRef, { margin: "-25% 0px -25% 0px", amount: 0.15 });

  return (
    <section id="galerie" ref={sectionRef} className="luxury-section bg-white/35">
      <div className="mx-auto max-w-6xl">
        <GalleryHeader inView={inView} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: slideEase }}
          className="relative"
        >
          <GallerySlideshow active={isActive} revealed={inView} />
        </motion.div>
      </div>
    </section>
  );
}
