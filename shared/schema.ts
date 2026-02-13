import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const preorders = pgTable("preorders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  variant: text("variant").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPreorderSchema = createInsertSchema(preorders).omit({ id: true, createdAt: true });

export type Preorder = typeof preorders.$inferSelect;
export type InsertPreorder = z.infer<typeof insertPreorderSchema>;
