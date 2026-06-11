"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { COUPLE, COPY, WEDDING, WEDDING_IMAGES } from "@/lib/constants";
import { FloatingParticles } from "./FloatingParticles";
import { WeddingCountdown } from "./WeddingCountdown";

const ease = [0.22, 1, 0.36, 1] as const;

const heroBgReveal = {
  duration: 0.88,
  ease,
  delay: 0,
};

const contentReveal = {
  duration: 0.8,
  ease,
  delay: 0.12,
};

export function Hero({
  backgroundReady = false,
  contentReady = false,
}: {
  backgroundReady?: boolean;
  contentReady?: boolean;
}) {
  return (
    <section
      id="accueil"
      className="hero-section relative isolate min-h-[100svh] overflow-hidden md:px-6"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        initial={{ opacity: 0 }}
        animate={{ opacity: backgroundReady ? 1 : 0 }}
        transition={heroBgReveal}
        style={{ backgroundImage: `url('${WEDDING_IMAGES.hero}')` }}
        aria-hidden="true"
      />

      <motion.div
        className="hero-bg-overlay absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: backgroundReady ? 1 : 0 }}
        transition={heroBgReveal}
        aria-hidden="true"
      />

      {contentReady ? <FloatingParticles className="opacity-50 md:opacity-70" /> : null}

      <div className="hero-layout relative z-10 flex min-h-[100svh] w-full flex-col md:mx-auto md:max-w-4xl">
        <div className="hero-copy relative z-20 shrink-0 px-5 pt-[max(6.5rem,13svh)] text-center md:px-0 md:pt-[max(5rem,10svh)]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={contentReady ? { opacity: 1, y: 0 } : {}}
            transition={{ ...contentReveal, delay: 0.1 }}
            className="font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.3em] text-purple-royal uppercase"
          >
            {WEDDING.type}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={contentReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.22 }}
            className="mt-4 font-[family-name:var(--font-cormorant)] text-[clamp(2.6rem,9vw,5.5rem)] leading-[0.95] text-ink md:mt-5"
          >
            {COUPLE.full}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={contentReady ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="gold-line mx-auto my-3 w-28 origin-center md:my-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={contentReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.48 }}
            className="hero-subtitle mx-auto max-w-2xl font-[family-name:var(--font-playfair)] text-lg leading-relaxed text-ink-soft md:text-xl"
          >
            {COPY.heroSubtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={contentReady ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.62 }}
            className="mt-1 font-[family-name:var(--font-cormorant)] text-xl font-bold text-emerald md:mt-4 md:text-3xl"
          >
            {WEDDING.dateDisplay}
          </motion.p>

          <WeddingCountdown revealed={contentReady} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={contentReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease, delay: 0.8 }}
          className="hero-photo-slot pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[min(100vw,580px)] md:relative md:z-10 md:min-h-0 md:max-w-4xl md:flex-1"
        >
          <Image
            src={WEDDING_IMAGES.heroPhoto}
            alt={`${COUPLE.bride} et ${COUPLE.groom}`}
            fill
            className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(28,26,24,0.14)]"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={contentReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.88 }}
          className="hero-cta-row relative z-30 flex w-full shrink-0 flex-row items-stretch justify-center gap-2 px-4 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:gap-4 md:px-0 md:pt-3"
        >
          <a href="#programme" className="btn-primary btn-hero-cta flex-1 md:flex-none">
            Découvrir le programme
          </a>
          <a href="#rsvp" className="btn-secondary btn-hero-cta flex-1 md:flex-none">
            Confirmer ma présence
          </a>
        </motion.div>
      </div>
    </section>
  );
}
