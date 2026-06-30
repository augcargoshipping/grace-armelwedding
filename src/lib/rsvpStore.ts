import {
  addBlobSubmission,
  clearBlobSubmissions,
  getBlobAuthMode,
  isBlobStorageConfigured,
  listBlobSubmissions,
  mergeBlobSubmissions,
  probeBlobStorage,
} from "@/lib/rsvpBlobStore";
import {
  addRedisSubmission,
  clearRedisSubmissions,
  isRedisStorageConfigured,
  listRedisSubmissions,
  mergeRedisSubmissions,
  probeRedisStorage,
} from "@/lib/rsvpRedisStore";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { RsvpPayload, RsvpSubmission } from "@/lib/rsvpTypes";

export function isRsvpStorageConfigured() {
  return isRedisStorageConfigured() || isBlobStorageConfigured();
}

export function getRsvpStorageStatus() {
  const redis = isRedisStorageConfigured();
  const blob = isBlobStorageConfigured();

  return {
    configured: redis || blob,
    primary: redis ? "redis" : blob ? "blob" : "none",
    redis,
    blob,
    blobAuth: getBlobAuthMode(),
    supabaseLegacy: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
        process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    ),
  };
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

function mergeSubmissions(...groups: RsvpSubmission[][]): RsvpSubmission[] {
  const byId = new Map<string, RsvpSubmission>();

  for (const group of groups) {
    for (const entry of group) {
      if (entry.id) byId.set(entry.id, entry);
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function listRsvpSubmissions(): Promise<RsvpSubmission[]> {
  const [redisSubmissions, blobSubmissions, supabaseSubmissions] = await Promise.all([
    listRedisSubmissions(),
    listBlobSubmissions(),
    listSupabaseSubmissions(),
  ]);

  return mergeSubmissions(supabaseSubmissions, blobSubmissions, redisSubmissions);
}

export async function createRsvpSubmission(payload: RsvpPayload): Promise<RsvpSubmission> {
  if (isRedisStorageConfigured()) {
    return addRedisSubmission(payload);
  }

  if (isBlobStorageConfigured()) {
    return addBlobSubmission(payload);
  }

  throw new Error("RSVP storage not configured");
}

export async function importLegacySubmissions(submissions: RsvpSubmission[]): Promise<number> {
  if (isRedisStorageConfigured()) {
    return mergeRedisSubmissions(submissions);
  }

  return mergeBlobSubmissions(submissions);
}

export async function clearRsvpSubmissions(): Promise<void> {
  await Promise.all([clearRedisSubmissions(), clearBlobSubmissions()]);

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

export async function probeRsvpStorage() {
  const status = getRsvpStorageStatus();
  const [redis, blob] = await Promise.all([probeRedisStorage(), probeBlobStorage()]);

  return {
    ...status,
    probes: { redis, blob },
  };
}
