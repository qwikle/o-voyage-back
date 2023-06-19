-- Revert api:categories from pg

BEGIN;

DROP TABLE "categories";

COMMIT;
