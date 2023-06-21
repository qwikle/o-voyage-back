-- Revert api:unique_constraint_has_travelers from pg

BEGIN;

ALTER TABLE "has_travelers" DROP CONSTRAINT 
"unique_has_travelers_row";

COMMIT;
