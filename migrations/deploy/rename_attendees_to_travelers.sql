-- Deploy api:rename_attendees_to_travelers to pg

BEGIN;

ALTER TABLE "travel" RENAME COLUMN "number_of_attendees" TO "number_of_travelers";

CREATE OR REPLACE FUNCTION check_number_of_travelers() RETURNS trigger AS $$
BEGIN
    IF (SELECT COUNT(*) FROM "has_travelers" WHERE "travel_id" = NEW.id) >=
     (SELECT "number_of_travelers" FROM "travel" WHERE "id" = NEW.id) 
     THEN
        RAISE EXCEPTION 'Maximum number of travelers reached.';
    END IF;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

COMMIT;
