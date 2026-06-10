import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";

export const archiveItemsTable = pgTable("archive_items", {
  id: serial("id").primaryKey(),
  itemType: text("item_type").notNull(),
  fileUrl: text("file_url").notNull(),
  description: text("description"),
  profileId: integer("profile_id").notNull().references(() => profilesTable.id, { onDelete: "cascade" }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const questionnairesTable = pgTable("questionnaires", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profilesTable.id, { onDelete: "cascade" }),
  birthYear: integer("birth_year"),
  occupation: text("occupation"),
  hometown: text("hometown"),
  personality: text("personality"),
  favoriteFoods: text("favorite_foods"),
  traditions: text("traditions"),
  lifePhilosophy: text("life_philosophy"),
  memorableStories: text("memorable_stories"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertArchiveItemSchema = createInsertSchema(archiveItemsTable).omit({ id: true, uploadedAt: true });
export type InsertArchiveItem = z.infer<typeof insertArchiveItemSchema>;
export type ArchiveItem = typeof archiveItemsTable.$inferSelect;

export const insertQuestionnaireSchema = createInsertSchema(questionnairesTable).omit({ id: true, submittedAt: true });
export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type Questionnaire = typeof questionnairesTable.$inferSelect;
