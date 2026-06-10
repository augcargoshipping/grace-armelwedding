"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fireRsvpConfetti } from "@/lib/rsvpConfetti";

type RsvpSuccessCelebrationProps = {
  active: boolean;
  guestName?: string;
  onClose: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function RsvpSuccessCelebration({
  active,
  guestName,
  onClose,
}: RsvpSuccessCelebrationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    fireRsvpConfetti();

    const timer = window.setTimeout(() => {
      onClose();
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [active, onClose]);

  if (!mounted) return null;

  const greeting = guestName ? `Merci, ${guestName}` : "Merci";

  return createPortal(
    <AnimatePresence>
      {active ? (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-success-title"
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-[rgba(18,15,26,0.32)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          <motion.div
            className="rsvp-success-card relative w-full max-w-md px-8 py-10 text-center md:px-10 md:py-12"
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.75, ease }}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, #0f5e4c 0%, #1a7a62 100%)",
                boxShadow: "0 0 32px rgba(26, 122, 98, 0.35)",
              }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.12 }}
            >
              <Sparkles className="h-6 w-6 text-champagne-light" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.22 }}
              className="font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.3em] text-purple-royal uppercase"
            >
              Réponse reçue
            </motion.p>

            <motion.h3
              id="rsvp-success-title"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.32 }}
              className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl leading-tight text-ink md:text-5xl"
            >
              {greeting}
            </motion.h3>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.42 }}
              className="gold-line mx-auto my-5 w-24 origin-center"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.5 }}
              className="font-[family-name:var(--font-playfair)] text-lg leading-relaxed text-ink-soft md:text-xl"
            >
              Votre réponse a bien été enregistrée.
              <br />
              Nous avons hâte de partager ce jour avec vous.
            </motion.p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
