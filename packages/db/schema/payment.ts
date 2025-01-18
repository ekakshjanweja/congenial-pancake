import { relations } from "drizzle-orm";
import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { event } from "./event";

export const paymentState = pgEnum("payment_state", [
  "pending",
  "success",
  "failed",
]);

export const payment = pgTable("payment", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull(),
  userId: uuid("user_id").notNull(),
  status: paymentState("status").notNull().default("pending"),
});

export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, {
    fields: [payment.userId],
    references: [user.id],
  }),
  event: one(event, {
    fields: [payment.eventId],
    references: [event.id],
  }),
}));

export type PaymentSelect = typeof payment.$inferSelect;
export type PaymentInsert = typeof payment.$inferInsert;
