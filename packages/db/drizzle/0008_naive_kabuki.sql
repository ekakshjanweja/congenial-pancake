CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "location_id" uuid NOT NULL;