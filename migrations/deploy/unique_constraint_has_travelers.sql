-- Deploy api:unique_constraint_has_travelers to pg

BEGIN;

ALTER TABLE "has_travelers" ADD CONSTRAINT "unique_has_travelers_row"
UNIQUE ("traveler_id", "travel_id");

COMMIT;
