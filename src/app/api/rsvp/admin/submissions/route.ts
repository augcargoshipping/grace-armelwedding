import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/rsvpAdmin";
import { listRsvpSubmissions } from "@/lib/rsvpStore";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const submissions = await listRsvpSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Failed to load RSVP submissions:", error);
    return NextResponse.json(
      { error: "Impossible de charger les réponses pour le moment." },
      { status: 500 },
    );
  }
}
