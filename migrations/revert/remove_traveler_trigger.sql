-- Revert api:remove_traveler_trigger from pg

BEGIN;

DROP TRIGGER check_remover_traveler ON "has_travelers";

DROP FUNCTION check_remover_traveler();

COMMIT;
