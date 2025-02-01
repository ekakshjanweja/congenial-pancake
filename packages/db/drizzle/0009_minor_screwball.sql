ALTER TABLE "seat_type" ADD COLUMN "capacity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "seat_type" ADD COLUMN "filled" integer DEFAULT 0 NOT NULL;