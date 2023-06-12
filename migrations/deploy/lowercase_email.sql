-- Deploy api:lowercase_email to pg

BEGIN;

UPDATE "user"SET email = LOWER(email);

COMMIT;
