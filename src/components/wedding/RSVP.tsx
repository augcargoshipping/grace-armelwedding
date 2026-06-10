"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { COPY } from "@/lib/constants";
import { RsvpSuccessCelebration } from "./RsvpSuccessCelebration";

export function RSVP() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [successName, setSuccessName] = useState("");

  const closeCelebration = useCallback(() => {
    setCelebrating(false);
    setStatus("idle");
    setSuccessName("");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setStatus("loading");
    setError("");

    const form = new FormData(formEl);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      guestCount: Number(form.get("guestCount") ?? 1),
      attending: form.get("attending") === "oui",
      message: String(form.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Impossible d'envoyer votre réponse.");
      }
      const fullName = String(form.get("fullName") ?? "").trim();
      const firstName = fullName.split(/\s+/)[0] ?? "";
      setSuccessName(firstName);
      setStatus("success");
      setCelebrating(true);
      formEl.reset();
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Une erreur est survenue.");
    }
  }

  return (
    <section id="rsvp" ref={ref} className="luxury-section">
      <RsvpSuccessCelebration
        active={celebrating}
        guestName={successName}
        onClose={closeCelebration}
      />
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-[1.5rem] px-6 py-8 md:px-10 md:py-10"
        >
          <p className="text-center font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.28em] text-purple-royal uppercase">
            {COPY.rsvpNotice}
          </p>
          <h2 className="mt-4 text-center font-[family-name:var(--font-cormorant)] text-4xl text-ink">
            {COPY.rsvpTitle}
          </h2>
          <p className="mt-3 text-center font-[family-name:var(--font-playfair)] text-base text-ink-soft">
            {COPY.rsvpLimited}
            <br />
            {COPY.rsvpPrompt}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
                Nom et prénom
              </span>
              <input
                required
                name="fullName"
                className="w-full rounded-xl border border-champagne/25 bg-white/80 px-4 py-3 font-[family-name:var(--font-sans)] text-sm outline-none transition focus:border-emerald/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
                Téléphone
              </span>
              <input
                required
                name="phone"
                type="tel"
                autoComplete="tel"
                className="w-full rounded-xl border border-champagne/25 bg-white/80 px-4 py-3 font-[family-name:var(--font-sans)] text-sm outline-none transition focus:border-emerald/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
                Nombre de personnes
              </span>
              <select
                name="guestCount"
                defaultValue="1"
                className="w-full rounded-xl border border-champagne/25 bg-white/80 px-4 py-3 font-[family-name:var(--font-sans)] text-sm outline-none transition focus:border-emerald/40"
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="mb-2 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
                Présence
              </legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 font-[family-name:var(--font-sans)] text-sm">
                  <input type="radio" name="attending" value="oui" defaultChecked required />
                  Oui
                </label>
                <label className="flex items-center gap-2 font-[family-name:var(--font-sans)] text-sm">
                  <input type="radio" name="attending" value="non" />
                  Non
                </label>
              </div>
            </fieldset>

            <label className="block">
              <span className="mb-2 block font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
                Message
              </span>
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-xl border border-champagne/25 bg-white/80 px-4 py-3 font-[family-name:var(--font-sans)] text-sm outline-none transition focus:border-emerald/40"
              />
            </label>

            <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
              {status === "loading" ? "Envoi en cours…" : "Confirmer ma présence"}
            </button>

            {status === "error" ? (
              <p className="text-center font-[family-name:var(--font-sans)] text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
