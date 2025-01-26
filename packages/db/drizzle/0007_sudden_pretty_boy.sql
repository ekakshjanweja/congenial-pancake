CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"access_token_expires_at" timestamp NOT NULL,
	"refresh_token_expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_revoked" text DEFAULT 'false' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "start_date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "end_date" timestamp NOT NULL;