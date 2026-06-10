"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COPY, PROGRAM } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export function ProgramTimeline() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          x: -24,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="programme" ref={ref} className="luxury-section bg-white/40">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.28em] text-purple-royal uppercase">
            Le jour J
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl text-ink md:text-5xl">
            {COPY.programTitle}
          </h2>
          <div className="gold-line mx-auto my-6 w-24" />
        </div>

        <div className="relative mt-12 space-y-8 pl-8 md:pl-10">
          <div className="timeline-line absolute top-2 bottom-2 left-[11px] w-px md:left-[13px]" />
          {PROGRAM.map((event) => (
            <article key={event.id} className="timeline-item relative">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
