CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."size" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."species" AS ENUM('dog', 'cat', 'bird', 'rabbit', 'reptile');--> statement-breakpoint
CREATE TYPE "public"."swipe_direction" AS ENUM('adopt', 'pass');--> statement-breakpoint
CREATE TABLE "pets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"species" "species" NOT NULL,
	"breed" text NOT NULL,
	"age" text NOT NULL,
	"gender" "gender" NOT NULL,
	"size" "size" NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"location" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pets_image_url_unique" UNIQUE("image_url")
);
--> statement-breakpoint
CREATE TABLE "swipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"pet_id" uuid NOT NULL,
	"direction" "swipe_direction" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "swipes_user_id_pet_id_unique" UNIQUE("user_id","pet_id")
);
--> statement-breakpoint
ALTER TABLE "swipes" ADD CONSTRAINT "swipes_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "swipes_user_id_idx" ON "swipes" USING btree ("user_id");