"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { COUPLE } from "@/lib/constants";
import { toTelHref } from "@/lib/phone";
import type { RsvpSubmission } from "@/lib/rsvpTypes";

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function RsvpAdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>([]);

  const loadSubmissions = useCallback(async () => {
    const response = await fetch("/api/rsvp/admin/submissions", { cache: "no-store" });

    if (response.status === 401) {
      setAuthed(false);
      return;
    }

    if (!response.ok) {
      setError("Impossible de charger les réponses.");
      return;
    }

    const data = (await response.json()) as { submissions: RsvpSubmission[] };
    setSubmissions(data.submissions);
    setAuthed(true);
    setError("");
  }, []);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
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

      setPassword("");
      await loadSubmissions();
    } catch {
      setError("Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSubmissions();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await fetch("/api/rsvp/admin/logout", { method: "POST" });
    setAuthed(false);
    setSubmissions([]);
  };

  const stats = useMemo(() => {
    const attending = submissions.filter((s) => s.attending);
    const guests = attending.reduce((sum, s) => sum + s.guestCount, 0);
    return { total: submissions.length, attending: attending.length, guests };
  }, [submissions]);

  const csvContent = useMemo(() => {
    const header = "Nom,Téléphone,Personnes,Présence,Message,Date\n";
    const rows = submissions
      .map((entry) =>
        [
          entry.fullName,
          entry.phone,
          entry.guestCount,
          entry.attending ? "Oui" : "Non",
          entry.message ?? "",
          entry.createdAt,
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    return header + rows;
  }, [submissions]);

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      "Supprimer toutes les réponses RSVP enregistrées sur Vercel Blob ? Les données Supabase (si accessibles) seront aussi effacées. Cette action est irréversible.",
    );
    if (!confirmed) return;

    setClearing(true);
    setError("");

    try {
      const response = await fetch("/api/rsvp/admin/clear", { method: "POST" });
      if (!response.ok) {
        setError("Impossible de supprimer les réponses.");
        return;
      }

      await loadSubmissions();
    } catch {
      setError("Impossible de supprimer les réponses.");
    } finally {
      setClearing(false);
    }
  };

  const downloadCsv = () => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rsvp-grace-armel-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLegacy = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImporting(true);
    setError("");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const submissions = Array.isArray(parsed)
        ? parsed
        : typeof parsed === "object" &&
            parsed !== null &&
            Array.isArray((parsed as { submissions?: unknown[] }).submissions)
          ? (parsed as { submissions: unknown[] }).submissions
          : null;

      if (!submissions) {
        setError("Fichier JSON invalide. Utilisez un export Supabase ou un tableau JSON.");
        return;
      }

      const response = await fetch("/api/rsvp/admin/import-legacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissions }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Import impossible.");
        return;
      }

      const data = (await response.json()) as { added: number; total: number };
      window.alert(`${data.added} réponse(s) importée(s) sur ${data.total}.`);
      await loadSubmissions();
    } catch {
      setError("Import impossible. Vérifiez le format JSON.");
    } finally {
      setImporting(false);
    }
  };

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <p className="text-center font-[family-name:var(--font-cormorant)] text-3xl text-ink">
          {COUPLE.full}
        </p>
        <p className="mt-2 text-center font-[family-name:var(--font-sans)] text-xs tracking-[0.2em] text-ink-soft uppercase">
          Administration RSVP
        </p>

        <form onSubmit={handleLogin} className="glass-card mt-8 space-y-4 rounded-2xl p-6">
          <label className="block">
            <span className="mb-2 block font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
              Mot de passe
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-champagne/25 bg-white/80 px-4 py-3 text-sm outline-none focus:border-emerald/40"
              required
            />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
          {error ? <p className="text-center text-sm text-red-700">{error}</p> : null}
        </form>

        <Link href="/" className="mt-6 text-center text-sm text-emerald hover:underline">
          Retour au site
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-ink">
            Réponses RSVP
          </h1>
          <p className="mt-1 font-[family-name:var(--font-sans)] text-sm text-ink-soft">
            {stats.total} réponses · {stats.attending} présents · {stats.guests} personnes
          </p>
          <p className="mt-1 font-[family-name:var(--font-sans)] text-xs text-ink-soft/75">
            Nouvelles réponses : Vercel Blob · Archives Supabase fusionnées si disponibles
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleRefresh} className="btn-secondary" disabled={refreshing}>
            {refreshing ? "Actualisation…" : "Actualiser"}
          </button>
          <button type="button" onClick={downloadCsv} className="btn-secondary">
            Exporter CSV
          </button>
          <label className="btn-secondary cursor-pointer">
            {importing ? "Import…" : "Importer archive"}
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              disabled={importing}
              onChange={handleImportLegacy}
            />
          </label>
          <button type="button" onClick={handleLogout} className="btn-secondary">
            Déconnexion
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="btn-clear-rsvp"
            disabled={clearing || submissions.length === 0}
          >
            {clearing ? "Suppression…" : "Tout effacer"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-center font-[family-name:var(--font-sans)] text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 space-y-3">
        {submissions.length === 0 ? (
          <p className="text-center font-[family-name:var(--font-sans)] text-sm text-ink-soft">
            Aucune réponse pour le moment.
          </p>
        ) : (
          submissions.map((entry) => (
            <article key={entry.id} className="glass-card rounded-2xl px-5 py-4 md:px-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-ink">
                    {entry.fullName}
                  </h2>
                  <p className="mt-1 font-[family-name:var(--font-sans)] text-sm text-ink-soft">
                    <a href={toTelHref(entry.phone)} className="text-emerald hover:underline">
                      {entry.phone}
                    </a>
                    {" · "}
                    {entry.guestCount} personne{entry.guestCount > 1 ? "s" : ""}
                    {" · "}
                    {entry.attending ? "Présent" : "Absent"}
                  </p>
                  {entry.message ? (
                    <p className="mt-2 font-[family-name:var(--font-playfair)] text-sm italic text-ink-soft">
                      « {entry.message} »
                    </p>
                  ) : null}
                </div>
                <p className="font-[family-name:var(--font-sans)] text-xs text-ink-soft/80">
                  {formatDate(entry.createdAt)}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
