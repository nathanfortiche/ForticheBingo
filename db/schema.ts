import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const personalResolutions = pgTable("personal_resolutions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  status: text("status").default("Pas commencé"),
  position: integer("position").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertResolutionSchema = createInsertSchema(personalResolutions);
export const selectResolutionSchema = createSelectSchema(personalResolutions);
export type InsertResolution = typeof personalResolutions.$inferInsert;
export type SelectResolution = typeof personalResolutions.$inferSelect;