import { Hono } from "hono";
import { auth } from "../../../auth";
import { db } from "../../db";
import { audit_events } from "../../db/schema";
import { 
  checkClientRateLimit, 
  emailVerifyRateLimit, 
  ipRateLimit 
} from "../utils/rateLimit";
import { RATE_LIMIT_WINDOW, MAX_VERIFY_REQUESTS } from "../config";

export const verificationRoutes = new Hono();

verificationRoutes.post("/", async (c) => {
  const ip = c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown";
  const { email, code } = await c.req.json<{ email?: string; code?: string }>();

  if (!email || !code) {
    return c.json({ ok: false, error: "Email and OTP are required" }, 400);
  }

  // ✅ Rate-limit verification attempts by email
  if (checkClientRateLimit(email, emailVerifyRateLimit, MAX_VERIFY_REQUESTS, RATE_LIMIT_WINDOW)) {
    return c.json({ ok: false, error: "Too many verification attempts. Try again later." }, 429);
  }

  // ✅ Rate-limit verification attempts by IP
  if (checkClientRateLimit(ip, ipRateLimit, MAX_VERIFY_REQUESTS, RATE_LIMIT_WINDOW)) {
    return c.json({ ok: false, error: "Too many attempts from this IP. Try again later." }, 429);
  }

  try {
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
  } catch (err: any) {
    if (err?.body?.code === "INVALID_OTP") {
      await db.insert(audit_events).values({
        email,
        event_type: "FAILED",
        metadata: { reason: "Invalid or expired OTP" },
      });

      return c.json({ ok: false, error: "Invalid or expired OTP" }, 400);
    }

    console.error("Unexpected error:", err);
    return c.json({ ok: false, error: "Network error. Please try again." }, 500);
  }
});
