-- Deploy api:activities to pg
BEGIN;

CREATE TABLE "activity" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" "length_d" NOT NULL DEFAULT 'New Activity',
    "price" INTEGER NOT NULL CHECK ("price" >= 0) DEFAULT 0,
    "location" "length_d" NOT NULL,
    "members" INTEGER NOT NULL CHECK ("members" >= 1) DEFAULT 1,
    "time" TIME NOT NULL CHECK ("time" >= '00:00:00' AND "time" <= '23:59:59'),
    "date" DATE NOT NULL CHECK ("date" >= CURRENT_DATE),
    "travel_id" INTEGER NOT NULL REFERENCES "travel" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
