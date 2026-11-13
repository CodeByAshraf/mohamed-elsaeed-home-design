import { isIP } from "node:net";

/* In-memory limits for the consultation API. Every server process (instance, replica,
   serverless container) keeps its own counters, and they reset when it restarts, so these
   are per-process limits, not a site-wide guarantee across several instances. */

const MAX_PROXY_HOPS = 10;
const MAX_IP_LENGTH = 45; // longest textual IPv6 address (with an embedded IPv4 tail)

/** Shared key for a forwarded chain that does not yield a valid IP address. */
export const INVALID_CLIENT = "invalid";

/** TRUSTED_PROXY_HOPS as a whole number from 0 to 10; anything else counts as 0. */
export function trustedProxyHops(value = process.env.TRUSTED_PROXY_HOPS) {
  if (!value || !/^\d{1,2}$/.test(value.trim())) return 0;
  return Math.min(Number(value.trim()), MAX_PROXY_HOPS);
}

/**
 * The rate-limit key for a request, or null when no trustworthy client address exists.
 *
 * hops = 0 (default): X-Forwarded-For is never trusted. Next.js fills it from the socket
 * only when the client sent none, so inside a route handler the header cannot be told
 * apart from a spoofed one, and there is no per-client key.
 *
 * hops = N: exactly N reverse proxies sit in front of the app, each appending the address
 * it received the request from, and the app is reachable only through them. The client is
 * then the Nth entry from the right; entries further left are client-controlled.
 *
 * Only a bare IPv4 or IPv6 address is accepted. Ports ("1.2.3.4:80"), brackets ("[::1]")
 * and IPv6 zone IDs ("fe80::1%eth0") map to INVALID_CLIENT, so a varying suffix cannot
 * mint new keys.
 */
export function clientKey(forwardedFor: string | null, hops: number): string | null {
  if (hops <= 0) return null;
  const entries = (forwardedFor ?? "").split(",");
  const candidate = entries.length >= hops ? entries[entries.length - hops].trim() : "";
  if (candidate.length > MAX_IP_LENGTH || candidate.includes("%") || isIP(candidate) === 0) return INVALID_CLIENT;
  return candidate.toLowerCase().replace(/^::ffff:(?=\d+\.\d+\.\d+\.\d+$)/, "");
}

type RateLimiterOptions = {
  limit: number;
  windowMs: number;
  /** Hard cap on tracked keys; the least recently counted key is evicted beyond it. */
  maxKeys: number;
  now?: () => number;
};

/**
 * Sliding-window limiter: at most `limit` counted attempts per key per window. Refused
 * attempts are not recorded, so a key is free again one window after its oldest counted
 * attempt, however often it retries. Each key holds at most `limit` timestamps.
 *
 * Throws on options that are not positive whole numbers, rather than running with a limit
 * or cap that silently stops working.
 */
export function createRateLimiter({ limit, windowMs, maxKeys, now = Date.now }: RateLimiterOptions) {
  for (const [name, value] of Object.entries({ limit, windowMs, maxKeys })) {
    if (!Number.isSafeInteger(value) || value < 1) {
      throw new RangeError(`createRateLimiter: ${name} must be a positive whole number, got ${String(value)}`);
    }
  }
  const hits = new Map<string, number[]>();
  let nextSweep = 0;

  return {
    /** Counts the attempt and returns true if it is allowed; returns false without counting. */
    allow(key: string) {
      const t = now();
      if (t >= nextSweep) {
        for (const [k, times] of hits) if (t - times[times.length - 1] >= windowMs) hits.delete(k);
        nextSweep = t + Math.min(windowMs, 60_000);
      }

      const recent = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(t);
      hits.delete(key); // re-insert so Map order tracks the most recently counted key
      if (hits.size >= maxKeys) hits.delete(hits.keys().next().value!);
      hits.set(key, recent);
      return true;
    },
    size: () => hits.size,
  };
}

/**
 * Reads the request body as UTF-8 text, or returns null if it exceeds `maxBytes`.
 * A declared Content-Length over the limit is refused and the stream cancelled without
 * reading. Otherwise reading stops and the stream is cancelled as soon as the limit is
 * passed, which also bounds chunked bodies that declare no length.
 */
export async function readBodyLimited(request: Request, maxBytes: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (declared > maxBytes) {
    request.body?.cancel().catch(() => {});
    return null;
  }
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}
