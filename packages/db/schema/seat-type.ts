import { relations } from "drizzle-orm";
import { pgTable, text, uuid, integer } from "drizzle-orm/pg-core";
import { seat } from "./seat";

export const seatType = pgTable("seat_type", {
  id: uuid("id").defaultRandom().primaryKey(),
  seatTypeName: text("seat_type_name").notNull(),
  description: text("description").notNull(),
  eventName: text("event_name").notNull(),
  price: integer("price").notNull(),
});

export const seatTypeRelations = relations(seatType, ({ many }) => ({
  seat: many(seat),
}));

export type SeatTypeSelect = typeof seatType.$inferSelect;
export type SeatTypeInsert = typeof seatType.$inferInsert;
