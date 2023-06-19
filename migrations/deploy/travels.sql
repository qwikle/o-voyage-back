-- Deploy api:travels to pg

BEGIN;

CREATE DOMAIN "length_d" AS TEXT 
    CHECK (LENGTH(VALUE) >= 2);

CREATE TABLE "travel" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" "length_d" NOT NULL DEFAULT 'New Travel',
    "from" "length_d" NOT NULL,
    "to" "length_d" NOT NULL,
    "departure_date" TIMESTAMPTZ NOT NULL CHECK ("departure_date" >= NOW()),
    "arrival_date" TIMESTAMPTZ NOT NULL CHECK ("arrival_date" > "departure_date"),
    "budget" INTEGER NOT NULL CHECK ("budget" >= 0) DEFAULT 0,
    "number_of_attendees" INTEGER NOT NULL CHECK ("number_of_attendees" >= 1) DEFAULT 1,
    "organizer_id" INTEGER NOT NULL REFERENCES "user" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
