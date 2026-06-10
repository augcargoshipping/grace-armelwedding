"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { COUPLE, COPY, WEDDING, WEDDING_IMAGES } from "@/lib/constants";
import { FloatingParticles } from "./FloatingParticles";
import { WeddingCountdown } from "./WeddingCountdown";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ revealed = true }: { revealed?: boolean }) {
  return (
    <section
      id="accueil"
      className="hero-section relative isolate flex min-h-[100svh] flex-col overflow-hidden md:block md:items-center md:justify-center md:px-6 md:py-24"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.1, ease }}
        style={{ backgroundImage: `url('${WEDDING_IMAGES.hero}')` }}
        aria-hidden="true"
      />

      <motion.div
        className="hero-bg-overlay absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.1, ease }}
        aria-hidden="true"
      />

      <FloatingParticles className="opacity-50 md:opacity-70" />

      <div className="relative z-10 flex min-h-[100svh] w-full flex-col md:mx-auto md:min-h-0 md:max-w-4xl md:justify-center md:text-center">
        <div className="px-5 pt-[max(6.75rem,16svh)] text-center md:px-0 md:pt-0">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.3em] text-purple-royal uppercase"
          >
            {WEDDING.type}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.22 }}
            className="mt-4 font-[family-name:var(--font-cormorant)] text-[clamp(2.6rem,9vw,5.5rem)] leading-[0.95] text-ink md:mt-5"
          >
            {COUPLE.full}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={revealed ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="gold-line mx-auto my-5 w-28 origin-center md:my-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.48 }}
            className="mx-auto max-w-2xl font-[family-name:var(--font-playfair)] text-lg leading-relaxed text-ink-soft md:text-xl"
          >
            {COPY.heroSubtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.62 }}
            className="mt-3 font-[family-name:var(--font-cormorant)] text-xl font-bold text-emerald md:mt-4 md:text-3xl"
          >
            {WEDDING.dateDisplay}
          </motion.p>

          <WeddingCountdown revealed={revealed} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease, delay: 0.8 }}
          className="hero-photo-slot relative mx-auto mt-2 w-full max-w-md flex-1 px-4 md:mt-6 md:max-h-[min(34vh,280px)] md:flex-none md:px-0"
        >
          <Image
            src={WEDDING_IMAGES.heroPhoto}
            alt={`${COUPLE.bride} et ${COUPLE.groom}`}
            fill
            className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(28,26,24,0.14)]"
            sizes="(max-width: 768px) 92vw, 360px"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.88 }}
          className="hero-cta-row mt-auto flex w-full flex-row items-stretch justify-center gap-2 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 md:mt-8 md:gap-4 md:px-0 md:pb-0 md:pt-0"
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
