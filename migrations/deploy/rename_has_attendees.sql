-- Deploy api:rename_has_attendees to pg

BEGIN;

ALTER TABLE "has_attendees" RENAME TO "has_travelers";

COMMIT;
