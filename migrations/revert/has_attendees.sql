-- Revert api:has_attendees from pg

BEGIN;

DROP TABLE "has_attendees";

COMMIT;
