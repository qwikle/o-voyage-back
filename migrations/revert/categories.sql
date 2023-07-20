-- Revert api:categories from pg

BEGIN;

ALTER TABLE "activity"
DROP COLUMN "category_id" CASCADE;
DROP TABLE "category";

COMMIT;
