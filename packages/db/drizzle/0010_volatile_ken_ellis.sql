CREATE TABLE "booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
DROP TABLE "boooking" CASCADE;--> statement-breakpoint
ALTER TABLE "seat_type" ADD COLUMN "event_id" uuid NOT NULL;