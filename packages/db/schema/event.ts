import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { admin } from "./admin";
import { booking } from "./booking";
import { payment } from "./payment";
import { location } from "./location";

export const event = pgTable("event", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventName: text("event_name").notNull(),
  description: text("description").notNull(),
  bannerUrl: text("banner_url").notNull(),
  adminId: uuid("admin_id").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  locationId: uuid("location_id").notNull(),
});

export const eventRelations = relations(event, ({ one, many }) => ({
  admin: one(admin, {
    fields: [event.adminId],
    references: [admin.id],
    relationName: "event_admin",
  }),
  location: one(location, {
    fields: [event.locationId],
    references: [location.id],
  }),
  booking: many(booking),
  payment: many(payment),
}));

export type EventSelect = typeof event.$inferSelect;
export type EventInsert = typeof event.$inferInsert;
