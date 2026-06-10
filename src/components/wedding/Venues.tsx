"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { VENUES } from "@/lib/constants";

export function Venues() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <section id="lieux" ref={ref} className="luxury-section">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-ink md:text-5xl">
            Les Lieux
          </h2>
          <div className="gold-line mx-auto my-6 w-24" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {VENUES.map((venue, index) => (
            <motion.article
              key={venue.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className="glass-card rounded-2xl p-6 md:p-7"
            >
              <p className="font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.22em] text-emerald uppercase">
                {venue.description}
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl text-ink">
                {venue.name}
              </h3>
              <p className="mt-3 flex items-start gap-2 font-[family-name:var(--font-sans)] text-sm text-ink-soft">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                {venue.address}
              </p>
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-5"
              >
                Ouvrir dans Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
