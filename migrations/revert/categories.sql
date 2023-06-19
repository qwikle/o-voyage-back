-- Revert api:categories from pg

BEGIN;

DROP TABLE "category";

COMMIT;
