-- Revert api:rename_has_attendees from pg

BEGIN;

ALTER TABLE "has_travelers" RENAME TO "has_attendees";

COMMIT;
