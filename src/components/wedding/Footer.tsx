"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COUPLE, COPY, WEDDING } from "@/lib/constants";

export function Footer() {
  const router = useRouter();
  const tapCount = useRef(0);
  const tapTimer = useRef<number | null>(null);

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFooterTap = () => {
    tapCount.current += 1;

    if (tapTimer.current !== null) {
      window.clearTimeout(tapTimer.current);
    }

    tapTimer.current = window.setTimeout(() => {
      tapCount.current = 0;
    }, 900);

    if (tapCount.current >= 3) {
      tapCount.current = 0;
      setError("");
      setPassword("");
      setShowAdminLogin(true);
    }
  };

  const closeAdminLogin = () => {
    setShowAdminLogin(false);
    setPassword("");
    setError("");
    setLoading(false);
  };

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/rsvp/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Mot de passe incorrect.");
        return;
      }

      closeAdminLogin();
      router.push("/admin/rsvp");
    } catch {
      setError("Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer
        className="cursor-default px-6 py-14 text-center select-none"
        onClick={handleFooterTap}
      >
        <div className="gold-line mx-auto mb-8 w-32" />
        <p className="font-[family-name:var(--font-cormorant)] text-3xl text-ink">{COUPLE.full}</p>
        <p className="mt-2 font-[family-name:var(--font-playfair)] text-lg italic text-emerald">
          {WEDDING.dateDisplay}
        </p>
        <p className="mx-auto mt-5 max-w-md font-[family-name:var(--font-sans)] text-sm text-ink-soft">
          {COPY.footerThanks}
        </p>
      </footer>

      {showAdminLogin ? (
        <div
          className="fixed inset-0 z-[320] flex items-center justify-center bg-[rgba(18,15,26,0.55)] px-6 backdrop-blur-sm"
          onClick={closeAdminLogin}
          role="presentation"
        >
          <div
            className="glass-card w-full max-w-sm rounded-[1.35rem] px-6 py-7 md:px-8"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
          >
            <p
              id="admin-login-title"
              className="text-center font-[family-name:var(--font-cormorant)] text-2xl text-ink"
            >
              Administration
            </p>
            <p className="mt-2 text-center font-[family-name:var(--font-sans)] text-xs text-ink-soft">
              Accès réservé aux organisateurs
            </p>

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
                  Mot de passe
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoFocus
                  className="w-full rounded-xl border border-champagne/25 bg-white/80 px-4 py-3 font-[family-name:var(--font-sans)] text-sm outline-none transition focus:border-emerald/40"
                  required
                />
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={closeAdminLogin} className="btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? "Connexion…" : "Entrer"}
                </button>
              </div>

              {error ? (
                <p className="text-center font-[family-name:var(--font-sans)] text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
