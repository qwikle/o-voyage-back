-- Deploy api:trigger_function to pg

BEGIN;

CREATE FUNCTION add_organizer_to_travel() RETURNS trigger AS $$
BEGIN
    INSERT INTO "has_travelers" ("travel_id", "attendee_id")
    VALUES (NEW.id, NEW.organizer_id);
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER add_organizer_to_travel
AFTER INSERT ON "travel"
FOR EACH ROW
EXECUTE PROCEDURE add_organizer_to_travel();


CREATE FUNCTION check_number_of_travelers() RETURNS trigger AS $$
BEGIN
    IF (SELECT COUNT(*) FROM "has_travelers" WHERE "travel_id" = NEW.id) >=
     (SELECT "number_of_attendees" FROM "travel" WHERE "id" = NEW.id) 
     THEN
        RAISE EXCEPTION 'Maximum number of travelers reached.';
    END IF;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER check_number_of_travelers
BEFORE INSERT ON "has_travelers"
FOR EACH ROW
EXECUTE PROCEDURE check_number_of_travelers();


CREATE FUNCTION check_activity_date() RETURNS trigger AS $$
BEGIN
    IF (SELECT "departure_date" FROM "travel" WHERE "id" = NEW.travel_id) > NEW."date" THEN
        RAISE EXCEPTION 'Activity cannot be before travel start date.';
    END IF;
    IF (SELECT "arrival_date" FROM "travel" WHERE "id" = NEW.travel_id) < NEW."date" THEN
        RAISE EXCEPTION 'Activity cannot be after travel end date.';
    END IF;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER check_activity_date
BEFORE INSERT OR UPDATE ON "activity"
FOR EACH ROW
EXECUTE PROCEDURE check_activity_date();
COMMIT;
