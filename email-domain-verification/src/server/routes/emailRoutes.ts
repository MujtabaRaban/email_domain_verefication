// routes/emailRoutes.ts
import { Hono } from "hono";
import { auth } from "../../../auth";
import { db } from "../../db";
import { audit_events } from "../../db/schema";
import { emailRateLimit, ipRateLimit, checkClientRateLimit } from "../utils/rateLimit";

export const emailRoutes = new Hono();

emailRoutes.post("/", async (c) => {
  const ip = c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown";
  const { email } = await c.req.json<{ email?: string }>();

  if (!email || !email.toLowerCase().includes(".edu")) {
    return c.json({ ok: false, error: "Please use a valid .edu email" }, 400);
  }

  // ✅ Rate-limit by email
  if (checkClientRateLimit(email, emailRateLimit)) {
    return c.json({ ok: false, error: "Too many requests for this email. Try again later." }, 429);
  }

  // ✅ Rate-limit by IP
  if (checkClientRateLimit(ip, ipRateLimit)) {
    return c.json({ ok: false, error: "Too many requests from this IP. Try again later." }, 429);
  }

  // Proceed with sending OTP
  const result = await auth.api.sendVerificationOTP({
    body: { email, type: "sign-in" },
  });

  if (!result.success) {
    await db.insert(audit_events).values({
      email,
      event_type: "FAILED",
      metadata: { reason: "OTP send failed" },
    });
    return c.json({ ok: false, error: "Failed to send OTP" }, 400);
  }

  await db.insert(audit_events).values({
    email,
    event_type: "SENT",
    metadata: { type: "sign-in" },
  });

  return c.json({ ok: true, message: "OTP sent successfully" });
});
