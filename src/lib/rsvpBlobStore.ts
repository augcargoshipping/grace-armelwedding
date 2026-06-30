import { get, put } from "@vercel/blob";
import type { RsvpPayload, RsvpSubmission } from "@/lib/rsvpTypes";

const BLOB_PATH = "rsvp/submissions.json";

function findReadWriteToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return process.env.BLOB_READ_WRITE_TOKEN;
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("_READ_WRITE_TOKEN") && value) {
      return value;
    }
  }

  return undefined;
}

export function isBlobStorageConfigured() {
  return Boolean(process.env.BLOB_STORE_ID || findReadWriteToken());
}

function getPutOptions() {
  const token = findReadWriteToken();

  return {
    access: "private" as const,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    ...(token ? { token } : {}),
  };
}

function getReadOptions() {
  const token = findReadWriteToken();
  return {
    access: "private" as const,
    ...(token ? { token } : {}),
  };
}

async function readJsonFile(): Promise<RsvpSubmission[]> {
  if (!isBlobStorageConfigured()) return [];

  try {
    const result = await get(BLOB_PATH, getReadOptions());
    if (!result?.stream) return [];

    const text = await new Response(result.stream).text();
    if (!text.trim()) return [];

    const data = JSON.parse(text) as RsvpSubmission[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to read RSVP blob:", error);
    return [];
  }
}

async function writeJsonFile(submissions: RsvpSubmission[]): Promise<void> {
  if (!isBlobStorageConfigured()) {
    throw new Error("Blob storage not configured");
  }

  await put(BLOB_PATH, JSON.stringify(submissions), getPutOptions());
}

export async function listBlobSubmissions(): Promise<RsvpSubmission[]> {
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
  await writeJsonFile([]);
}
