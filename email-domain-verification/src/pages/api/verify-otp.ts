import { Hono } from "hono";
import { auth } from "../../../auth"; // server-side Better Auth instance
import { db } from "../../db"; // drizzle db instance
import { audit_events } from "../../db/schema"; // table schema

export const verifyOtpRoute = new Hono();

verifyOtpRoute.post("/", async (c) => {
  try {
    const { email, otp } = await c.req.json<{ email?: string; otp?: string }>();

    if (!email || !otp) {
      return c.json({ error: "Email and OTP are required" }, 400);
    }

    // ✅ Verify OTP using Better Auth
    const result = await auth.api.signInEmailOTP({
      body: { email, otp },
    });

    if (!result || !("user" in result)) {
      // signInEmailOTP returns user/token if success, undefined otherwise
      return c.json({ error: "Invalid or expired OTP" }, 400);
    }

    // ✅ Log event in audit_events table
    await db.insert(audit_events).values({
      email,
      event_type: "otp_verified",
      metadata: { type: "sign-in" },
    });

    return c.json({ success: true, user: result.user }, 200);
  } catch (error) {
    console.error("Verify OTP error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
