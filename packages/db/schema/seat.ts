import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { seatType } from "./seat-type";
import { booking } from "./booking";

export const seat = pgTable("seat", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: uuid("seat_type").notNull(),
  qr: text("qr").notNull(),
  bookingId: uuid("booking_id").notNull(),
});

export const seatRelations = relations(seat, ({ one }) => ({
  seatType: one(seatType, {
    fields: [seat.type],
    references: [seatType.id],
  }),
  booking: one(booking, {
    fields: [seat.bookingId],
    references: [booking.id],
  }),
}));

export type SeatSelect = typeof seat.$inferSelect;
export type SeatInsert = typeof seat.$inferInsert;
