import { Redis } from "@upstash/redis";
import type { RsvpPayload, RsvpSubmission } from "@/lib/rsvpTypes";

const SUBMISSIONS_KEY = "rsvp:submissions";
const ID_INDEX_KEY = "rsvp:ids";

function findEnvBySuffix(suffix: string, filter?: (key: string) => boolean): string | undefined {
  for (const [key, value] of Object.entries(process.env)) {
    if (!value?.trim() || !key.endsWith(suffix)) continue;
    if (filter && !filter(key)) continue;
    return value.trim();
  }
  return undefined;
}

function resolveRedisCredentials() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim() ||
    findEnvBySuffix("_REST_API_URL", (key) => {
      const upper = key.toUpperCase();
      return upper.includes("REDIS") || upper.includes("KV");
    });

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim() ||
    findEnvBySuffix("_REST_API_TOKEN", (key) => {
      const upper = key.toUpperCase();
      return upper.includes("REDIS") || upper.includes("KV");
    });

  return { url, token };
}

let redisClient: Redis | null = null;

function getRedisClient() {
  if (redisClient) return redisClient;

  const { url, token } = resolveRedisCredentials();
  if (!url || !token) {
    throw new Error("Redis storage not configured");
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

export function isRedisStorageConfigured() {
  const { url, token } = resolveRedisCredentials();
  return Boolean(url && token);
}

function parseSubmission(raw: unknown): RsvpSubmission | null {
  if (!raw || typeof raw !== "object") return null;
  const entry = raw as RsvpSubmission;
  if (!entry.id || !entry.fullName || !entry.phone || !entry.createdAt) return null;
  return entry;
}

export async function listRedisSubmissions(): Promise<RsvpSubmission[]> {
  if (!isRedisStorageConfigured()) return [];

  const redis = getRedisClient();
  const rawItems = await redis.lrange(SUBMISSIONS_KEY, 0, -1);
  const submissions: RsvpSubmission[] = [];

  for (const raw of rawItems) {
    const parsed =
      typeof raw === "string"
        ? parseSubmission(JSON.parse(raw))
        : parseSubmission(raw);
    if (parsed) submissions.push(parsed);
  }

  return submissions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addRedisSubmission(payload: RsvpPayload): Promise<RsvpSubmission> {
  const entry: RsvpSubmission = {
    id: crypto.randomUUID(),
    fullName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    guestCount: payload.guestCount,
    attending: payload.attending,
    message: payload.message?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  const redis = getRedisClient();
  await redis
    .multi()
    .lpush(SUBMISSIONS_KEY, JSON.stringify(entry))
    .sadd(ID_INDEX_KEY, entry.id)
    .exec();

  return entry;
}

export async function mergeRedisSubmissions(incoming: RsvpSubmission[]): Promise<number> {
  const redis = getRedisClient();
  const existingIds = (await redis.smembers(ID_INDEX_KEY)) as string[];
  const seen = new Set(existingIds ?? []);
  let added = 0;

  for (const entry of incoming) {
    if (!entry.id || seen.has(entry.id)) continue;
    await redis
      .multi()
      .lpush(SUBMISSIONS_KEY, JSON.stringify(entry))
      .sadd(ID_INDEX_KEY, entry.id)
      .exec();
    seen.add(entry.id);
    added += 1;
  }

  return added;
}

export async function clearRedisSubmissions(): Promise<void> {
  if (!isRedisStorageConfigured()) return;
  const redis = getRedisClient();
  await redis.del(SUBMISSIONS_KEY, ID_INDEX_KEY);
}

export async function probeRedisStorage(): Promise<{ ok: boolean; error?: string }> {
  if (!isRedisStorageConfigured()) {
    return { ok: false, error: "Redis env vars missing" };
  }

  try {
    const redis = getRedisClient();
    const probeKey = `rsvp:probe:${Date.now()}`;
    await redis.set(probeKey, "1", { ex: 30 });
    await redis.del(probeKey);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Redis probe failed";
    return { ok: false, error: message };
  }
}
