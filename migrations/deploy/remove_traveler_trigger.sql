-- Deploy api:remove_traveler_trigger to pg

BEGIN;

CREATE FUNCTION check_remover_traveler() RETURNS TRIGGER AS $$
BEGIN

    IF (SELECT "organizer_id" FROM "travel" WHERE "id" = OLD.travel_id) = OLD.traveler_id THEN
        RAISE EXCEPTION 'Organizer cannot be removed from the travel.';
    END IF;
    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER check_remover_traveler
BEFORE DELETE ON "has_travelers"
FOR EACH ROW
EXECUTE PROCEDURE check_remover_traveler();


COMMIT;
