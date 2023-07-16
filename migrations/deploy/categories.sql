-- Deploy api:categories to pg

BEGIN;

CREATE TABLE "category" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

INSERT INTO "category" ("name")
VALUES 
    ('Repas'),
    ('Activité'),
    ('Trajet'), 
    ('Hébergement');

ALTER TABLE "activity"
ADD COLUMN "category_id" INTEGER NOT NULL REFERENCES "category" ("id") DEFAULT 2 ON DELETE CASCADE;


COMMIT;
