import { pgTable, text, serial, timestamp, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";

export const timeCapsulesTable = pgTable("time_capsules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  occasion: text("occasion").notNull().default("custom"),
  scheduledDate: date("scheduled_date", { mode: "string" }).notNull(),
  audioUrl: text("audio_url"),
  isLocked: boolean("is_locked").notNull().default(true),
  profileId: integer("profile_id").notNull().references(() => profilesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTimeCapsuleSchema = createInsertSchema(timeCapsulesTable).omit({ id: true, createdAt: true });
export type InsertTimeCapsule = z.infer<typeof insertTimeCapsuleSchema>;
export type TimeCapsule = typeof timeCapsulesTable.$inferSelect;
