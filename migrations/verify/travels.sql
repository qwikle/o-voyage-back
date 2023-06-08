-- Verify api:travels on pg

BEGIN;

SELECT * FROM "travel" WHERE FALSE;

ROLLBACK;
