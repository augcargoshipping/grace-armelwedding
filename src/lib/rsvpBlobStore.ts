import { del, get, list, put } from "@vercel/blob";
import type { RsvpPayload, RsvpSubmission } from "@/lib/rsvpTypes";

const RSVP_PREFIX = "rsvp/";
const LEGACY_INDEX_PATH = "rsvp/submissions.json";

type BlobCallOptions = {
  access: "private";
  token?: string;
  storeId?: string;
};

function findEnvBySuffix(suffix: string, filter?: (key: string) => boolean): string | undefined {
  for (const [key, value] of Object.entries(process.env)) {
    if (!value?.trim() || !key.endsWith(suffix)) continue;
    if (filter && !filter(key)) continue;
    return value.trim();
  }
  return undefined;
}

function resolveCredentials() {
  const token =
    process.env.BLOB_READ_WRITE_TOKEN?.trim() || findEnvBySuffix("_READ_WRITE_TOKEN");

  const storeId =
    process.env.BLOB_STORE_ID?.trim() ||
    findEnvBySuffix("_STORE_ID", (key) => key.toUpperCase().includes("BLOB"));

  return { token, storeId };
}

export function isBlobStorageConfigured() {
  const { token, storeId } = resolveCredentials();
  if (token || storeId) return true;

  return Object.keys(process.env).some((key) => {
    const upper = key.toUpperCase();
    return upper.includes("BLOB") && Boolean(process.env[key]?.trim());
  });
}

function callOptions(): BlobCallOptions {
  const { token, storeId } = resolveCredentials();
  const options: BlobCallOptions = { access: "private" };

  if (token) {
    options.token = token;
  } else if (storeId) {
    options.storeId = storeId;
  }

  return options;
}

function putOptions() {
  return {
    ...callOptions(),
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  };
}

async function parseSubmissionBlob(pathname: string, url: string): Promise<RsvpSubmission | null> {
  try {
    const result = await get(url, callOptions());
    if (!result?.stream) return null;

    const text = await new Response(result.stream).text();
    if (!text.trim()) return null;

    return JSON.parse(text) as RsvpSubmission;
  } catch (error) {
    console.error("Failed to read RSVP blob entry:", pathname, error);
    return null;
  }
}

async function readLegacyIndex(): Promise<RsvpSubmission[]> {
  try {
    const result = await get(LEGACY_INDEX_PATH, callOptions());
    if (!result?.stream) return [];

    const text = await new Response(result.stream).text();
    if (!text.trim()) return [];

    const data = JSON.parse(text) as RsvpSubmission[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function listSubmissionFiles(): Promise<RsvpSubmission[]> {
  if (!isBlobStorageConfigured()) return [];

  const submissions: RsvpSubmission[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({
      prefix: RSVP_PREFIX,
      cursor,
      ...callOptions(),
    });

    for (const blob of page.blobs) {
      if (blob.pathname === LEGACY_INDEX_PATH) continue;
      if (!blob.pathname.endsWith(".json")) continue;

      const entry = await parseSubmissionBlob(blob.pathname, blob.url);
      if (entry?.id) submissions.push(entry);
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return submissions;
}

function sortSubmissions(submissions: RsvpSubmission[]) {
  return submissions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function listBlobSubmissions(): Promise<RsvpSubmission[]> {
  const [legacy, files] = await Promise.all([readLegacyIndex(), listSubmissionFiles()]);
  const byId = new Map<string, RsvpSubmission>();

  for (const entry of legacy) {
    if (entry.id) byId.set(entry.id, entry);
  }

  for (const entry of files) {
    byId.set(entry.id, entry);
  }

  return sortSubmissions(Array.from(byId.values()));
}

export async function addBlobSubmission(payload: RsvpPayload): Promise<RsvpSubmission> {
  const entry: RsvpSubmission = {
    id: crypto.randomUUID(),
    fullName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    guestCount: payload.guestCount,
    attending: payload.attending,
    message: payload.message?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  await put(`${RSVP_PREFIX}${entry.id}.json`, JSON.stringify(entry), putOptions());
  return entry;
}

export async function mergeBlobSubmissions(incoming: RsvpSubmission[]): Promise<number> {
  const existing = await listBlobSubmissions();
  const seen = new Set(existing.map((entry) => entry.id));
  let added = 0;

  for (const entry of incoming) {
    if (!entry.id || seen.has(entry.id)) continue;
    await put(`${RSVP_PREFIX}${entry.id}.json`, JSON.stringify(entry), putOptions());
    seen.add(entry.id);
    added += 1;
  }

  return added;
}

export async function clearBlobSubmissions(): Promise<void> {
  if (!isBlobStorageConfigured()) {
    throw new Error("Blob storage not configured");
  }

  let cursor: string | undefined;

  do {
    const page = await list({
      prefix: RSVP_PREFIX,
      cursor,
      ...callOptions(),
    });

    if (page.blobs.length > 0) {
      await del(
        page.blobs.map((blob) => blob.url),
        callOptions(),
      );
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
}
