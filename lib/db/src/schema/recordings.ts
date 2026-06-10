import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";

export const recordingsTable = pgTable("recordings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  audioUrl: text("audio_url"),
  chapter: text("chapter").notNull(),
  promptId: integer("prompt_id"),
  profileId: integer("profile_id").notNull().references(() => profilesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRecordingSchema = createInsertSchema(recordingsTable).omit({ id: true, createdAt: true });
export type InsertRecording = z.infer<typeof insertRecordingSchema>;
export type Recording = typeof recordingsTable.$inferSelect;
