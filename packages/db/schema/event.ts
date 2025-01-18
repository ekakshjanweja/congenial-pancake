import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { admin } from "./admin";
import { booking } from "./booking";
import { payment } from "./payment";

export const event = pgTable("event", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventName: text("event_name").notNull(),
  description: text("description").notNull(),
  bannerUrl: text("banner_url").notNull(),
  adminId: uuid("admin_id").notNull(),
});

export const eventRelations = relations(event, ({ one, many }) => ({
  admin: one(admin, {
    fields: [event.adminId],
    references: [admin.id],
    relationName: "event_admin",
  }),
  booking: many(booking),
  payment: many(payment),
}));
