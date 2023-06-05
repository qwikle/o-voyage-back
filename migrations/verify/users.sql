-- Verify api:users on pg

BEGIN;

SELECT * FROM "user" WHERE FALSE;

SELECT * FROM "role" WHERE FALSE;
ROLLBACK;
