import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/rsvpAdmin";
import { importLegacySubmissions } from "@/lib/rsvpStore";
import type { RsvpSubmission } from "@/lib/rsvpTypes";

function normalizeSubmission(raw: unknown): RsvpSubmission | null {
  if (!raw || typeof raw !== "object") return null;

  const entry = raw as Record<string, unknown>;
  const id = typeof entry.id === "string" ? entry.id : "";
  const fullName =
    typeof entry.fullName === "string"
      ? entry.fullName
      : typeof entry.full_name === "string"
        ? entry.full_name
        : "";
  const phone = typeof entry.phone === "string" ? entry.phone : "";
  const guestCount =
    typeof entry.guestCount === "number"
      ? entry.guestCount
      : typeof entry.guest_count === "number"
        ? entry.guest_count
        : NaN;
  const attending = typeof entry.attending === "boolean" ? entry.attending : false;
  const message =
    typeof entry.message === "string"
      ? entry.message
      : entry.message === null
        ? null
        : null;
  const createdAt =
    typeof entry.createdAt === "string"
      ? entry.createdAt
      : typeof entry.created_at === "string"
        ? entry.created_at
        : "";

  if (!id || !fullName || !phone || !createdAt || !Number.isFinite(guestCount)) {
    return null;
  }

  return {
    id,
    fullName,
    phone,
    guestCount,
    attending,
    message,
    createdAt,
  };
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = (await request.json()) as { submissions?: unknown[] };
    if (!Array.isArray(body.submissions)) {
      return NextResponse.json({ error: "Format d'import invalide." }, { status: 400 });
    }

    const submissions = body.submissions
      .map((entry) => normalizeSubmission(entry))
      .filter((entry): entry is RsvpSubmission => entry !== null);

    if (submissions.length === 0) {
      return NextResponse.json({ error: "Aucune réponse valide à importer." }, { status: 400 });
    }

    const added = await importLegacySubmissions(submissions);
    return NextResponse.json({ ok: true, added, total: submissions.length });
  } catch (error) {
    console.error("Failed to import legacy RSVP submissions:", error);
    return NextResponse.json({ error: "Impossible d'importer les réponses." }, { status: 500 });
  }
}
