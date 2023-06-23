-- Revert api:slug_to_travel from pg

BEGIN;

DROP TRIGGER set_slug_based_on_title_and_id ON "travel";

DROP FUNCTION set_slug_based_on_title_and_id();

ALTER TABLE "travel" DROP COLUMN "slug";

COMMIT;
