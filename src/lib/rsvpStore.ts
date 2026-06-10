import { getSupabaseAdmin } from "@/lib/supabase";
import type { RsvpSubmission } from "@/lib/rsvpTypes";

export async function listRsvpSubmissions(): Promise<RsvpSubmission[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("rsvp_submissions")
    .select("id, full_name, phone, guest_count, attending, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to list RSVP submissions:", error);
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    guestCount: row.guest_count,
    attending: row.attending,
    message: row.message,
    createdAt: row.created_at,
  }));
}

export async function clearRsvpSubmissions(): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { error } = await supabase
    .from("rsvp_submissions")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.error("Failed to clear RSVP submissions:", error);
    throw error;
  }
}
