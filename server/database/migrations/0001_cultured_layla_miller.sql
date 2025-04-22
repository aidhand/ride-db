ALTER TABLE "lists" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_slug_unique" UNIQUE("slug");