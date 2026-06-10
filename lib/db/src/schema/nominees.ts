import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const nomineesTable = pgTable("nominees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNomineeSchema = createInsertSchema(nomineesTable).omit({ id: true, createdAt: true });
export type InsertNominee = z.infer<typeof insertNomineeSchema>;
export type Nominee = typeof nomineesTable.$inferSelect;
