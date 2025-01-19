import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./schema/schema";
import { config } from "dotenv";

export * from "./schema/user";
export * from "./schema/admin";
export * from "./schema/event";
export * from "./schema/booking";
export * from "./schema/payment";
export * from "./schema/seat";
export * from "./schema/seat-type";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle(process.env.DATABASE_URL, {
  schema: schema,
});
