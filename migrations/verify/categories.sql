-- Verify api:categories on pg

BEGIN;

SELECT * FROM "categories" WHERE FALSE;

ROLLBACK;
