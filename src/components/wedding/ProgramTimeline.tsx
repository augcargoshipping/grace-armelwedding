"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { COPY, PROGRAM } from "@/lib/constants";

const ease = [0.22, 1, 0.36, 1] as const;

function TimelineItem({
  event,
  index,
}: {
  event: (typeof PROGRAM)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: Math.min(index * 0.06, 0.24) }}
      className="timeline-item relative"
    >
      <span className="absolute top-2 -left-[1.35rem] h-3 w-3 rounded-full border-2 border-white bg-emerald shadow-[0_0_0_4px_rgba(26,122,98,0.15)] md:-left-[1.55rem]" />
      <div className="glass-card rounded-2xl px-6 py-5 md:px-7 md:py-6">
        <p className="font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.2em] text-emerald uppercase">
          {event.time}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl text-ink">
          {event.title}
        </h3>
        <p className="mt-2 font-[family-name:var(--font-playfair)] text-base text-ink-soft">
          {event.venue}
        </p>
        <p className="font-[family-name:var(--font-sans)] text-sm text-ink-soft/80">
          {event.address}
          <br />
          {event.city}
        </p>
      </div>
    </motion.article>
  );
}

export function ProgramTimeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section id="programme" ref={ref} className="luxury-section bg-white/40">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center"
        >
          <p className="font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.28em] text-purple-royal uppercase">
            Le jour J
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl text-ink md:text-5xl">
            {COPY.programTitle}
          </h2>
          <div className="gold-line mx-auto my-6 w-24" />
        </motion.div>

        <div className="relative mt-12 space-y-8 pl-8 md:pl-10">
          <div className="timeline-line absolute top-2 bottom-2 left-[11px] w-px md:left-[13px]" />
          {PROGRAM.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
