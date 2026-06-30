import { list, put } from "@vercel/blob";
import type { RsvpPayload, RsvpSubmission } from "@/lib/rsvpTypes";

const BLOB_PATH = "rsvp/submissions.json";

function getToken() {
  return process.env.BLOB_READ_WRITE_TOKEN ?? "";
}

export function isBlobStorageConfigured() {
  return Boolean(getToken());
}

async function readJsonFile(): Promise<RsvpSubmission[]> {
  const token = getToken();
  if (!token) return [];

  const { blobs } = await list({ prefix: BLOB_PATH, token });
  const file = blobs.find((blob) => blob.pathname === BLOB_PATH);
  if (!file) return [];

  const response = await fetch(file.url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to read RSVP blob:", response.status, response.statusText);
    return [];
  }

  const data = (await response.json()) as RsvpSubmission[];
  return Array.isArray(data) ? data : [];
}

async function writeJsonFile(submissions: RsvpSubmission[]): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error("Blob storage not configured");
  }

  await put(BLOB_PATH, JSON.stringify(submissions), {
    access: "private",
    token,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function listBlobSubmissions(): Promise<RsvpSubmission[]> {
  if (!isBlobStorageConfigured()) return [];
  return readJsonFile();
}

export async function addBlobSubmission(payload: RsvpPayload): Promise<RsvpSubmission> {
  const submissions = await readJsonFile();
  const entry: RsvpSubmission = {
    id: crypto.randomUUID(),
    fullName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    guestCount: payload.guestCount,
    attending: payload.attending,
    message: payload.message?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  submissions.unshift(entry);
  await writeJsonFile(submissions);
  return entry;
}

export async function mergeBlobSubmissions(incoming: RsvpSubmission[]): Promise<number> {
  if (!isBlobStorageConfigured()) {
    throw new Error("Blob storage not configured");
  }

  const existing = await readJsonFile();
  const seen = new Set(existing.map((entry) => entry.id));
  let added = 0;

  for (const entry of incoming) {
    if (!entry.id || seen.has(entry.id)) continue;
    existing.push(entry);
    seen.add(entry.id);
    added += 1;
  }

  existing.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  await writeJsonFile(existing);
  return added;
}

export async function clearBlobSubmissions(): Promise<void> {
  if (!isBlobStorageConfigured()) {
    throw new Error("Blob storage not configured");
  }

  await writeJsonFile([]);
}
