-- Revert api:trigger_function from pg

BEGIN;

DROP TRIGGER add_organizer_to_travel ON "travel";

DROP FUNCTION add_organizer_to_travel();

DROP TRIGGER check_number_of_travelers ON "has_travelers";

DROP FUNCTION check_number_of_travelers();

DROP TRIGGER check_activity_date ON "activity";

DROP FUNCTION check_activity_date();
COMMIT;
