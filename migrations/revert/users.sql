-- Revert api:users from pg

BEGIN;


DROP TABLE "user";
DROP TABLE "role";

DROP DOMAIN "email_d";

COMMIT;
