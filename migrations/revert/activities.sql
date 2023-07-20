-- Revert api:activities from pg

BEGIN;
DROP TABLE "activity";
COMMIT;
