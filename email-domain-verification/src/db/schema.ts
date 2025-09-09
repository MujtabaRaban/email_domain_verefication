import { pgTable, timestamp, text, uuid, boolean, jsonb } from "drizzle-orm/pg-core";

export const emails = pgTable("emails", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  domain: text("domain").notNull(),
  verified_at: timestamp("verified_at"), 
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const verification_codes = pgTable("verification_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  code_hash: text("code_hash").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const audit_events = pgTable("audit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email"), 
  event_type: text("event_type").notNull(),
  metadata: jsonb("metadata"), 
  created_at: timestamp("created_at").defaultNow().notNull(),
});
