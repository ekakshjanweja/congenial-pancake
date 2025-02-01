import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { event, location, seatType } from "@repo/db";
import type { EventInsert, LocationInsert, SeatTypeInsert } from "@repo/db";

export const CreateEventSchema: z.ZodType<EventInsert> =
  createInsertSchema(event);

export const UpdateEventSchema: z.ZodType<Partial<EventInsert>> =
  createUpdateSchema(event);

export const CreateLocationSchema: z.ZodType<LocationInsert> =
  createInsertSchema(location);

export const CreateSeatTypeSchema: z.ZodType<SeatTypeInsert> =
  createInsertSchema(seatType);
