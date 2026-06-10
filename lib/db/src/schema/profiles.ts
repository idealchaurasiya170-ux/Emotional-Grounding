import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  seniorName: text("senior_name").notNull(),
  hometown: text("hometown").notNull(),
  favoriteThings: text("favorite_things").notNull(),
  lifeMantra: text("life_mantra").notNull(),
  profileType: text("profile_type").notNull().default("living"),
  photoUrl: text("photo_url"),
  voiceSnippetUrl: text("voice_snippet_url"),
  storyCount: integer("story_count").notNull().default(0),
  minutesUsedThisMonth: integer("minutes_used_this_month").notNull().default(0),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ id: true, createdAt: true, storyCount: true, minutesUsedThisMonth: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
