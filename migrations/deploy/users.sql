-- Deploy api:users to pg

BEGIN;

CREATE DOMAIN "email_d" AS TEXT
    CHECK (VALUE ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$');

CREATE DOMAIN "password_d" AS TEXT
    CHECK (VALUE ~* '^[A-Z0-9._%+-]{8,}$');

CREATE TABLE "role" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

INSERT INTO "role" (
    "name"
) VALUES (
    'user'
), (
    'admin'
);
CREATE TABLE "user" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "firstname" TEXT NOT NULL CHECK (LENGTH("firstname") >= 2),
    "lastname" TEXT NOT NULL CHECK (LENGTH("lastname") >= 2),
    "email" "email_d" NOT NULL UNIQUE,
    "password" "password_d" NOT NULL,
    "is_banned" BOOLEAN NOT NULL DEFAULT FALSE,
    "role_id" INTEGER NOT NULL REFERENCES "role" ("id") DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
