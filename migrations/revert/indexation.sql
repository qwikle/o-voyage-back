-- Revert api:indexation from pg

BEGIN;

DROP INDEX idx_travels;

DROP INDEX idx_activities;

DROP FUNCTION get_travelers(travel_id integer[]);

DROP FUNCTION get_travels(traveler_id integer[]);

DROP FUNCTION get_one_traveler(traveler_id integer, travel_id integer);

ALTER TABLE "has_travelers" RENAME COLUMN "traveler_id" TO "attendee_id";


COMMIT;
