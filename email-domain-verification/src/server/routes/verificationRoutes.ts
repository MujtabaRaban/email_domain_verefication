// routes/verificationRoutes.ts
import { Hono } from "hono";
import { auth } from "../../../auth";       // server-side Better Auth instance


export const verificationRoutes = new Hono();

// routes/verificationRoutes.ts
import { checkClientRateLimit, emailRateLimit, ipRateLimit } from "../utils/rateLimit";

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
    return c.json({ ok: false, error: "Invalid or expired OTP" }, 400);
  }

  return c.json({ ok: true, user: result.user });
});

