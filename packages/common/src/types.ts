import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { event, location } from "@repo/db";
import type { EventInsert, LocationInsert } from "@repo/db";

export const CreateEventSchema: z.ZodType<EventInsert> =
  createInsertSchema(event);

export const CreateLocationSchema: z.ZodType<LocationInsert> =
  createInsertSchema(location);
