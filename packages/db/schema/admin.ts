import { relations } from "drizzle-orm";
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { event } from "./event";

export const admin = pgTable("admin", {
  id: uuid("id").defaultRandom(),
  phoneNumber: text("phone_number").primaryKey(),
  username: text("username").notNull(),
  verified: boolean("verified").notNull().default(false),
});

export const adminRelations = relations(admin, ({ many }) => ({
  event: many(event),
}));
