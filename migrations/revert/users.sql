-- Revert api:users from pg

BEGIN;


DROP TABLE "user";
DROP TABLE "role";

DROP DOMAIN "password_d";

DROP DOMAIN "email_d";

COMMIT;
