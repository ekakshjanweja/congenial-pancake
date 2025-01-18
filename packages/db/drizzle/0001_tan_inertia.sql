CREATE TABLE "admin" (
	"id" uuid DEFAULT gen_random_uuid(),
	"phone_number" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boooking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" text NOT NULL,
	"description" text NOT NULL,
	"banner_url" text NOT NULL,
	"admin_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "payment_state" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seat_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seat_type_name" text NOT NULL,
	"description" text NOT NULL,
	"event_name" text NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seat_type" uuid NOT NULL,
	"qr" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid DEFAULT gen_random_uuid(),
	"phone_number" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;