import { COPY, WEDDING } from "@/lib/constants";
import { toTelHref } from "@/lib/phone";

export function ImportantInfo() {
  return (
    <section id="infos" className="luxury-section bg-white/40">
      <div className="mx-auto max-w-2xl">
        <div className="glass-card rounded-[1.5rem] px-8 py-10 text-center md:px-10">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ink md:text-4xl">
            {COPY.infoTitle}
          </h2>
          <div className="gold-line mx-auto my-6 w-20" />
          <p className="font-[family-name:var(--font-playfair)] text-lg text-ink-soft">
            {COPY.rsvpNotice}
          </p>
          <p className="mt-2 font-[family-name:var(--font-sans)] text-sm tracking-[0.12em] text-ink-soft uppercase">
            {COPY.rsvpLimited}
          </p>
          <p className="mt-8 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.2em] text-emerald uppercase">
            Contact Jour-J
          </p>
          <a
            href={toTelHref(WEDDING.dayContact)}
            className="tel-link mt-2 inline-block font-[family-name:var(--font-cormorant)] text-2xl text-emerald underline decoration-champagne/50 underline-offset-4 transition hover:text-emerald-light hover:decoration-champagne"
          >
            {WEDDING.dayContact}
          </a>
        </div>
      </div>
    </section>
  );
}
