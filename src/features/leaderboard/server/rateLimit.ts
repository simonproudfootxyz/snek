import type { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

const requestStore = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return "unknown";
}

export function isAllowedToSubmitLeaderboard(request: NextRequest): boolean {
  const clientIp = getClientIp(request);
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existing = requestStore.get(clientIp) ?? [];
  const recent = existing.filter((timestamp) => timestamp >= windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestStore.set(clientIp, recent);
    return false;
  }

  recent.push(now);
  requestStore.set(clientIp, recent);
  return true;
}
