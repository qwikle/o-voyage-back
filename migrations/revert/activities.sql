-- Revert api:activities from pg

BEGIN;

DROP TABLE "activity";
DROP DOMAIN "length_d";
COMMIT;
