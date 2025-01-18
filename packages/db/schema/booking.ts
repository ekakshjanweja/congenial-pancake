import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { event } from "./event";
import { user } from "./user";
import { seat } from "./seat";

export const booking = pgTable("boooking", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull(),
  userId: uuid("user_id").notNull(),
});

export const bookingRelations = relations(booking, ({ one, many }) => ({
  event: one(event, {
    fields: [booking.eventId],
    references: [event.id],
  }),
  user: one(user, {
    fields: [booking.userId],
    references: [user.id],
  }),
  seat: many(seat),
}));

export type BookingSelect = typeof booking.$inferSelect;
export type BookingInsert = typeof booking.$inferInsert;
