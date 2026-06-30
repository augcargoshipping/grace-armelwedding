import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/rsvpAdmin";
import { probeRsvpStorage } from "@/lib/rsvpStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const status = await probeRsvpStorage();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Failed to probe RSVP storage:", error);
    return NextResponse.json({ error: "Diagnostic impossible." }, { status: 500 });
  }
}
