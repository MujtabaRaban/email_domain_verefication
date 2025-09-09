import { RATE_LIMIT_WINDOW, MAX_REQUESTS_PER_WINDOW } from '../config';

export interface RateLimitRecord {
  count: number;
  lastRequest: number;
}

export const emailRateLimit = new Map<string, RateLimitRecord>();
export const ipRateLimit = new Map<string, RateLimitRecord>();

export function checkClientRateLimit(identifier: string, rateLimitMap: Map<string, RateLimitRecord>): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (record) {
    if (now - record.lastRequest < RATE_LIMIT_WINDOW && record.count >= MAX_REQUESTS_PER_WINDOW) {
      return true;
    } else if (now - record.lastRequest < RATE_LIMIT_WINDOW) {
      record.count += 1;
    } else {
      record.count = 1;
    }
    record.lastRequest = now;
  } else {
    rateLimitMap.set(identifier, { count: 1, lastRequest: now });
  }

  return false;
}