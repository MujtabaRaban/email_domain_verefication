// lib/auth.ts
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./src/db/schema"; 
import { resend } from "./src/resend";
import bcrypt from "bcryptjs";


const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
      schema,
      provider: "pg"
  }),
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 600, // 10 minutes

      storeOTP: "hashed", 
      
      
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in" ? "Sign In Code" :
          type === "email-verification" ? "Email Verification Code" :
          "Password Reset Code";

        // send OTP via Resend
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject,
          html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
        });
        
      },

    }),
  ],
});
