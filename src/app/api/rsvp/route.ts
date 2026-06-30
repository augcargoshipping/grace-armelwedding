import { NextResponse } from "next/server";
import { createRsvpSubmission, isRsvpStorageConfigured } from "@/lib/rsvpStore";
import type { RsvpPayload } from "@/lib/rsvpTypes";

function validate(payload: RsvpPayload) {
  if (!payload.fullName?.trim()) return "Le nom et prénom sont requis.";
  if (!payload.phone?.trim()) return "Le téléphone est requis.";
  if (!Number.isFinite(payload.guestCount) || payload.guestCount < 1 || payload.guestCount > 10) {
    return "Le nombre de personnes doit être entre 1 et 10.";
  }
  return null;
}

export async function POST(request: Request) {
  try {
    if (!isRsvpStorageConfigured()) {
      return NextResponse.json(
        { error: "Le stockage RSVP n'est pas encore configuré." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as RsvpPayload;
    const error = validate(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const entry = await createRsvpSubmission(body);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch (error) {
    console.error("RSVP route error:", error);
    return NextResponse.json({ error: "Impossible d'enregistrer votre réponse." }, { status: 500 });
  }
}
