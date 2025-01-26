import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { event } from "./event";

export const location = pgTable("location", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const locationRelations = relations(location, ({ many }) => ({
  event: many(event),
}));

export type LocationSelect = typeof location.$inferSelect;
export type LocationInsert = typeof location.$inferInsert;
