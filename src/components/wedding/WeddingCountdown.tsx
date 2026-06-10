"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WEDDING } from "@/lib/constants";
import { useCountdown } from "@/hooks/useCountdown";

const ease = [0.22, 1, 0.36, 1] as const;

const UNITS = [
  { key: "days" as const, label: "Jours", pad: false },
  { key: "hours" as const, label: "Heures", pad: true },
  { key: "minutes" as const, label: "Min.", pad: true },
  { key: "seconds" as const, label: "Sec.", pad: true },
] as const;

type WeddingCountdownProps = {
  revealed?: boolean;
};

function CountdownValue({
  value,
  pad,
  animate,
}: {
  value: number;
  pad: boolean;
  animate?: boolean;
}) {
  const text = pad ? String(value).padStart(2, "0") : String(value);

  if (!animate) {
    return (
      <span className="countdown-value font-[family-name:var(--font-cormorant)] tabular-nums">
        {text}
      </span>
    );
  }

  return (
    <span className="countdown-value relative inline-flex overflow-hidden font-[family-name:var(--font-cormorant)] tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          className="inline-block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function WeddingCountdown({ revealed = true }: WeddingCountdownProps) {
  const countdown = useCountdown(WEDDING.countdown);

  if (countdown.isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={revealed ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease, delay: 0.68 }}
        className="countdown-complete countdown-glass mt-6 inline-block rounded-full px-8 py-3"
      >
        <p className="font-[family-name:var(--font-playfair)] text-lg italic text-champagne-light md:text-xl">
          C&apos;est le grand jour !
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={revealed ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease, delay: 0.68 }}
      className="mt-3 md:mt-7"
      aria-live="polite"
      aria-label="Compte à rebours jusqu'au mariage"
    >
      <p className="mb-1.5 font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.32em] text-emerald uppercase md:mb-3">
        Jusqu&apos;au grand jour
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={revealed ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease, delay: 0.74 }}
        className="countdown-band mx-auto inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-[1.75rem] p-2 sm:gap-2.5 sm:p-2.5"
      >
        {UNITS.map((unit, index) => (
          <div key={unit.key} className="flex items-center">
            {index > 0 ? (
              <span className="countdown-separator mx-1.5 sm:mx-2" aria-hidden="true" />
            ) : null}

            <div className="countdown-tile flex min-w-[3.6rem] flex-col items-center gap-1 px-3 py-2.5 sm:min-w-[4.25rem] sm:px-4 sm:py-3">
              <CountdownValue
                value={countdown[unit.key]}
                pad={unit.pad}
                animate={unit.key === "seconds"}
              />
              <span className="font-[family-name:var(--font-sans)] text-[9px] font-semibold tracking-[0.2em] text-emerald/85 uppercase sm:text-[10px]">
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
