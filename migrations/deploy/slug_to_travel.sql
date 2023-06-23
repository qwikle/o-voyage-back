-- Deploy api:slug_to_travel to pg

BEGIN;

ALTER TABLE "travel" ADD COLUMN "slug" TEXT UNIQUE; -- we create the column first so that we can use it in the trigger

CREATE FUNCTION set_slug_based_on_title_and_id() RETURNS TRIGGER AS $$ -- we create the function second so that we can use it in the trigger
BEGIN  
    NEW.slug := regexp_replace(trim(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', ' ', 'g')), ' ', '-', 'g') || '-' || NEW.id;
  RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER set_slug_based_on_title_and_id -- we create the trigger last so that we can use the function and column in it
  BEFORE INSERT OR UPDATE ON "travel"
  FOR EACH ROW EXECUTE PROCEDURE set_slug_based_on_title_and_id();

  UPDATE "travel" SET "slug" = regexp_replace(trim(regexp_replace(title, '[^a-zA-Z0-9]+', ' ', 'g')), ' ', '-', 'g') || '-' || id; -- we update the existing rows

  ALTER TABLE "travel" ALTER COLUMN "slug" SET NOT NULL; -- finally, we set the column to NOT NULL

DROP FUNCTION get_travels(func_traveler_id integer[]) CASCADE;

  CREATE FUNCTION get_travels(func_traveler_id integer[]) RETURNS TABLE ("id" INTEGER, "title" "length_d", "from" "length_d", "to" "length_d", "departure_date" TIMESTAMPTZ, "arrival_date" TIMESTAMPTZ, "budget" INTEGER, "number_of_travelers" INTEGER, "organizer_id" INTEGER, "created_at" TIMESTAMPTZ, "updated_at" TIMESTAMPTZ, "slug" TEXT,"traveler_id" INTEGER) AS $$
BEGIN
  RETURN QUERY 
  SELECT "travel".*, "has_travelers"."traveler_id" FROM "travel"
  JOIN "has_travelers" ON "has_travelers"."travel_id" = "travel"."id"
  WHERE "has_travelers"."traveler_id" = ANY(func_traveler_id);
END;
$$ LANGUAGE plpgsql;

COMMIT;
