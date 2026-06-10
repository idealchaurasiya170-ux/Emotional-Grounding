import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";

export const callSessionsTable = pgTable("call_sessions", {
  id: serial("id").primaryKey(),
  sessionType: text("session_type").notNull().default("audio"),
  durationMinutes: integer("duration_minutes").notNull().default(0),
  profileId: integer("profile_id").notNull().references(() => profilesTable.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCallSessionSchema = createInsertSchema(callSessionsTable).omit({ id: true, startedAt: true });
export type InsertCallSession = z.infer<typeof insertCallSessionSchema>;
export type CallSession = typeof callSessionsTable.$inferSelect;
