-- Deploy api:categories to pg

BEGIN;

CREATE TABLE "categories" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

INSERT INTO "categories" ("name") VALUES ('Repas');
INSERT INTO "categories" ("name") VALUES ('Activité');
INSERT INTO "categories" ("name") VALUES ('Trajet');
INSERT INTO "categories" ("name") VALUES ('Hébergement');

COMMIT;
