-- Revert api:travels from pg

BEGIN;

DROP TABLE "travel";
DROP DOMAIN "length_d";

COMMIT;
