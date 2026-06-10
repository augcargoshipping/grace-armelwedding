"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COUPLE, COPY, WEDDING } from "@/lib/constants";
import { FloatingParticles } from "./FloatingParticles";

type Phase = "idle" | "breaking" | "flap" | "card" | "zoom" | "exit";

type InvitationOpenerProps = {
  onOpenStart?: () => void;
  onReveal: () => void;
  onFinish: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function InvitationOpener({ onOpenStart, onReveal, onFinish }: InvitationOpenerProps) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const open = useCallback(() => {
    if (phase !== "idle") return;
    onOpenStart?.();
    setPhase("breaking");
    window.setTimeout(() => setPhase("flap"), 520);
    window.setTimeout(() => setPhase("card"), 1100);
    window.setTimeout(() => {
      setPhase("zoom");
      onReveal();
    }, 2400);
    window.setTimeout(() => setPhase("exit"), 3600);
    window.setTimeout(() => onFinish(), 4400);
  }, [onFinish, onOpenStart, onReveal, phase]);

  const instruction =
    phase === "idle" ? COPY.openerTap : phase === "breaking" || phase === "flap" ? COPY.openerOpening : "";

  const showEnvelope = phase === "idle" || phase === "breaking" || phase === "flap";
  const showCard = phase === "card" || phase === "zoom" || phase === "exit";

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-[#120f1a]"
      initial={{ opacity: 1 }}
      animate={{
        opacity: phase === "exit" ? 0 : 1,
        scale: phase === "zoom" || phase === "exit" ? 1.06 : 1,
      }}
      transition={{ duration: phase === "exit" ? 0.9 : 1.4, ease }}
    >
      <div className="opener-rays absolute inset-0" aria-hidden="true" />
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{
          opacity: phase === "zoom" ? 0.55 : 0.25,
          scale: phase === "zoom" ? 1.15 : 1,
        }}
        transition={{ duration: 1.2, ease }}
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(212,175,55,0.22) 0%, transparent 50%)",
        }}
      />
      <FloatingParticles />

      <AnimatePresence mode="wait">
        {showEnvelope ? (
          <motion.div
            key="envelope"
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 48, scale: 0.9 }}
            animate={{
              opacity: phase === "flap" ? 0.35 : 1,
              y: phase === "idle" ? [0, -10, 0] : phase === "flap" ? -6 : 0,
              scale: phase === "flap" ? 0.96 : 1,
            }}
            exit={{ opacity: 0, scale: 1.04, y: -24 }}
            transition={{
              opacity: { duration: 0.55 },
              y: phase === "idle" ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.7, ease },
              scale: { duration: 0.7, ease },
            }}
          >
            <button
              type="button"
              onClick={open}
              disabled={phase !== "idle"}
              className="group relative mx-auto block cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
              aria-label="Ouvrir l'invitation de mariage"
            >
              <div
                className="relative h-[min(58vw,320px)] w-[min(78vw,430px)] overflow-hidden rounded-sm"
                style={{
                  background:
                    "linear-gradient(145deg, #f0d78c 0%, #d4af37 38%, #b8942e 72%, #e8d5a3 100%)",
                  boxShadow:
                    "0 28px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 8px rgba(0,0,0,0.12)",
                }}
              >
                <motion.div
                  className="absolute inset-x-0 top-0 z-10 h-[46%] origin-top rounded-t-sm"
                  style={{
                    background: "linear-gradient(180deg, #ebd08a 0%, #d4af37 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    boxShadow: "inset 0 2px 12px rgba(255,255,255,0.2)",
                  }}
                  animate={{
                    rotateX: phase === "flap" ? -118 : 0,
                    y: phase === "flap" ? -8 : 0,
                  }}
                  transition={{ duration: 0.65, ease }}
                />

                <motion.div
                  className="absolute inset-x-[8%] bottom-[10%] top-[38%] rounded-sm"
                  style={{
                    background: "linear-gradient(180deg, #fffdf8 0%, #f8f4eb 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(201,169,98,0.25)",
                  }}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{
                    y: phase === "flap" ? "0%" : "100%",
                    opacity: phase === "flap" ? 0.85 : 0,
                  }}
                  transition={{ duration: 0.7, ease, delay: phase === "flap" ? 0.15 : 0 }}
                />

                <motion.div
                  className="absolute left-1/2 top-[42%] z-20 flex h-[min(18vw,88px)] w-[min(18vw,88px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full emerald-glow"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, #2d9b7a 0%, #0f5e4c 55%, #083d32 100%)",
                    border: "3px solid rgba(255,255,255,0.15)",
                  }}
                  animate={
                    phase === "breaking" || phase === "flap"
                      ? {
                          scale: [1, 1.12, 0.4, 0],
                          opacity: [1, 1, 0.6, 0],
                          rotate: [0, -6, 14, 22],
                        }
                      : { scale: [1, 1.03, 1], opacity: 1 }
                  }
                  transition={
                    phase === "breaking" || phase === "flap"
                      ? { duration: 0.55, ease }
                      : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  <span className="font-[family-name:var(--font-playfair)] text-[clamp(1.1rem,4vw,1.6rem)] font-semibold italic text-champagne-light">
                    {COUPLE.initials}
                  </span>
                </motion.div>

                {phase === "breaking" ? (
                  <motion.div
                    className="pointer-events-none absolute left-1/2 top-[42%] z-30 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    initial={{ scale: 0.4, opacity: 0.8 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.6, ease }}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(26,122,98,0.45) 0%, transparent 70%)",
                    }}
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCard ? (
          <motion.div
            key="card"
            className="relative z-20 mx-auto w-[min(88vw,420px)]"
            initial={{ opacity: 0, y: 120, rotateX: 22, scale: 0.82 }}
            animate={{
              opacity: phase === "exit" ? 0 : 1,
              y: phase === "zoom" ? -28 : 0,
              rotateX: 0,
              scale: phase === "zoom" ? 1.12 : 1,
            }}
            transition={{ duration: 1.15, ease }}
            style={{ transformPerspective: 1400 }}
          >
            <div className="glass-card rounded-[1.35rem] px-8 py-10 text-center md:px-10 md:py-12">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.28em] text-purple-royal uppercase"
              >
                {WEDDING.type}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.75 }}
                className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl leading-none text-ink md:text-6xl"
              >
                {COUPLE.full}
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.55, duration: 0.7, ease }}
                className="gold-line mx-auto my-5 w-24 origin-center"
              />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.7 }}
                className="font-[family-name:var(--font-playfair)] text-lg italic text-emerald md:text-xl"
              >
                {WEDDING.dateLong}
              </motion.p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {instruction ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-30 text-center font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.24em] text-white/75 uppercase"
        >
          {instruction}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
