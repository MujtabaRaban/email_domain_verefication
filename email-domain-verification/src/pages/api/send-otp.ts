import { Hono } from "hono";
import { auth } from "../../../auth"; // server-side Better Auth instance
import { db } from "../../db"; // drizzle db instance
import { audit_events } from "../../db/schema"; // table schema

export const sendOtpRoute = new Hono();

sendOtpRoute.post("/", async (c) => {
  try {
    const { email } = await c.req.json<{ email?: string }>();

    if (!email || !email.toLowerCase().includes(".edu")) {
      return c.json({ error: "Please use a valid .edu email" }, 400);
    }

    // ✅ Sends OTP & writes to verification table automatically
    const result = await auth.api.sendVerificationOTP({
      body: { email, type: "sign-in" },
    });

    if (!result.success) {
      return c.json({ error: "Failed to send OTP" }, 400);
    }

    // ✅ Log event in audit_events table
    await db.insert(audit_events).values({
      email,
      event_type: "otp_sent",
      metadata: { type: "sign-in" },
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error("Send OTP error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
