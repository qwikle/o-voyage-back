-- Deploy api:has_attendees to pg

BEGIN;

CREATE TABLE "has_attendees" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "attendee_id" INTEGER NOT NULL REFERENCES "user"("id"),
    "travel_id" INTEGER NOT NULL REFERENCES "travel"("id")
);

COMMIT;
