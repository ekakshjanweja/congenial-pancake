import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { booking } from "./booking";
import { payment } from "./payment";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom(),
  phoneNumber: text("phone_number").primaryKey(),
  username: text("username").notNull().default(""),
  verified: boolean("verified").notNull().default(false),
});

export const userRelations = relations(user, ({ many }) => ({
  bookings: many(booking),
  payments: many(payment),
}));

export type UserSelect = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
