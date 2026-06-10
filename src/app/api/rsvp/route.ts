import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
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
    if (!isSupabaseConfigured()) {
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

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Configuration Supabase invalide." }, { status: 503 });
    }

    const { data, error: insertError } = await supabase
      .from("rsvp_submissions")
      .insert({
        full_name: body.fullName.trim(),
        phone: body.phone.trim(),
        email: "",
        guest_count: body.guestCount,
        attending: body.attending,
        message: body.message?.trim() || null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("RSVP insert failed:", insertError);
      return NextResponse.json({ error: "Impossible d'enregistrer votre réponse." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    console.error("RSVP route error:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
