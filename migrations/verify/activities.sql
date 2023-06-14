-- Verify api:activities on pg

BEGIN;

SELECT * FROM "activities" WHERE FALSE;

ROLLBACK;
