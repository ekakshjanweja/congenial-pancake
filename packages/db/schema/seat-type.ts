import { relations } from "drizzle-orm";
import { pgTable, text, uuid, integer } from "drizzle-orm/pg-core";
import { seat } from "./seat";
import { event } from "./event";

export const seatType = pgTable("seat_type", {
  id: uuid("id").defaultRandom().primaryKey(),
  seatTypeName: text("seat_type_name").notNull(),
  description: text("description").notNull(),
  eventId: uuid("event_id").notNull(),
  price: integer("price").notNull(),
  capacity: integer("capacity").notNull().default(1),
  filled: integer("filled").notNull().default(0),
});

export const seatTypeRelations = relations(seatType, ({ one, many }) => ({
  seat: many(seat),
  event: one(event, {
    fields: [seatType.eventId],
    references: [event.id],
  }),
}));

export type SeatTypeSelect = typeof seatType.$inferSelect;
export type SeatTypeInsert = typeof seatType.$inferInsert;
