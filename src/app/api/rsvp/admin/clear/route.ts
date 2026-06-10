import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/rsvpAdmin";
import { clearRsvpSubmissions } from "@/lib/rsvpStore";

export async function POST() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    await clearRsvpSubmissions();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to clear RSVP submissions:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer les réponses pour le moment." },
      { status: 500 },
    );
  }
}
