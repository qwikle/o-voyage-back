-- Deploy api:activities to pg

BEGIN;

CREATE DOMAIN "length_d" AS TEXT 
    CHECK (LENGTH(VALUE) >= 2);
CREATE TABLE "activity" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" "length_d" TEXT NOT NULL DEFAULT 'New Activity',
    "price" INTEGER NOT NULL CHECK ("price" >= 0) DEFAULT 0,
    "location" "length_d" TEXT NOT NULL,
    "members" INTEGER NOT NULL CHECK ("members" >= 1) DEFAULT 1,
    "time" TIMESTAMPTZ NOT NULL CHECK ("time" >= NOW()),
    "date" TIMESTAMPTZ NOT NULL CHECK ("date" >= NOW()),
    "travel_id" INTEGER NOT NULL REFERENCES "travel" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
