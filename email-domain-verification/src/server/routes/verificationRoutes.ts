import { Hono } from "hono";
import { auth } from "../../../auth";
import { db } from "../../db";
import { audit_events } from "../../db/schema";
import { checkClientRateLimit, emailRateLimit, ipRateLimit } from "../utils/rateLimit";

export const verificationRoutes = new Hono();

verificationRoutes.post("/", async (c) => {
  const ip = c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown";
  const { email, code } = await c.req.json<{ email?: string; code?: string }>();

  if (!email || !code) {
    return c.json({ ok: false, error: "Email and OTP are required" }, 400);
  }

  // ✅ Rate-limit verification attempts
  if (checkClientRateLimit(email, emailRateLimit)) {
    return c.json({ ok: false, error: "Too many attempts for this email. Try again later." }, 429);
  }

  if (checkClientRateLimit(ip, ipRateLimit)) {
    return c.json({ ok: false, error: "Too many attempts from this IP. Try again later." }, 429);
  }

  // Proceed with OTP verification
  const result = await auth.api.signInEmailOTP({
    body: { email, otp: code },
  });

  if (!result || !("user" in result)) {
    await db.insert(audit_events).values({
      email,
      event_type: "FAILED",
      metadata: { reason: "Invalid or expired OTP" },
    });

    return c.json({ ok: false, error: "Invalid or expired OTP" }, 400);
  }

  await db.insert(audit_events).values({
    email,
    event_type: "CONFIRMED",
    metadata: { userId: result.user.id },
  });

  return c.json({ ok: true, user: result.user });
});
