ALTER TABLE "exercises" ADD COLUMN "progression_count" integer NOT NULL DEFAULT 5;
--> statement-breakpoint
UPDATE "exercises" SET "progression_count" = 9 WHERE "sort_order" IN (1, 2);
--> statement-breakpoint
UPDATE "exercises" SET "progression_count" = 10 WHERE "sort_order" IN (3, 4, 5, 6);
