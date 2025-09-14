import { RATE_LIMIT_WINDOW, MAX_SEND_EMAIL_REQUESTS, MAX_VERIFY_REQUESTS } from '../config';

export interface RateLimitRecord {
  count: number;
  lastRequest: number;
}

// Separate maps for sending OTP and verifying OTP
export const emailSendRateLimit = new Map<string, RateLimitRecord>();
export const emailVerifyRateLimit = new Map<string, RateLimitRecord>();
export const ipRateLimit = new Map<string, RateLimitRecord>();

/**
 * Generic rate-limit checker
 */
export function checkClientRateLimit(
  identifier: string,
  rateLimitMap: Map<string, RateLimitRecord>,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (record) {
    if (now - record.lastRequest < windowMs && record.count >= maxRequests) {
      return true; // limit exceeded
    } else if (now - record.lastRequest < windowMs) {
      record.count += 1;
    } else {
      record.count = 1; // window expired
    }
    record.lastRequest = now;
  } else {
    rateLimitMap.set(identifier, { count: 1, lastRequest: now });
  }

  return false;
}
