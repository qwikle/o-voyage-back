-- Verify api:users on pg

BEGIN;

SELECT * FROM "users" WHERE FALSE;

ROLLBACK;
