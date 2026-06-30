import {
  addBlobSubmission,
  clearBlobSubmissions,
  isBlobStorageConfigured,
  listBlobSubmissions,
  mergeBlobSubmissions,
} from "@/lib/rsvpBlobStore";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { RsvpPayload, RsvpSubmission } from "@/lib/rsvpTypes";

export function isRsvpStorageConfigured() {
  return isBlobStorageConfigured();
}

async function listSupabaseSubmissions(): Promise<RsvpSubmission[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("rsvp_submissions")
    .select("id, full_name, phone, guest_count, attending, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase RSVP list unavailable (project may be paused):", error.message);
    return [];
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

function mergeSubmissions(
  blobSubmissions: RsvpSubmission[],
  supabaseSubmissions: RsvpSubmission[],
): RsvpSubmission[] {
  const byId = new Map<string, RsvpSubmission>();

  for (const entry of supabaseSubmissions) {
    byId.set(entry.id, entry);
  }

  for (const entry of blobSubmissions) {
    byId.set(entry.id, entry);
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function listRsvpSubmissions(): Promise<RsvpSubmission[]> {
  const [blobSubmissions, supabaseSubmissions] = await Promise.all([
    listBlobSubmissions(),
    listSupabaseSubmissions(),
  ]);

  return mergeSubmissions(blobSubmissions, supabaseSubmissions);
}

export async function createRsvpSubmission(payload: RsvpPayload): Promise<RsvpSubmission> {
  if (!isBlobStorageConfigured()) {
    throw new Error("RSVP storage not configured");
  }

  return addBlobSubmission(payload);
}

export async function importLegacySubmissions(submissions: RsvpSubmission[]): Promise<number> {
  return mergeBlobSubmissions(submissions);
}

export async function clearRsvpSubmissions(): Promise<void> {
  await clearBlobSubmissions();

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase
    .from("rsvp_submissions")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.warn("Supabase RSVP clear skipped:", error.message);
  }
}
