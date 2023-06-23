-- Revert api:slug_to_travel from pg

BEGIN;


DROP FUNCTION get_travels(func_traveler_id integer[]) CASCADE;
CREATE FUNCTION get_travels(func_traveler_id integer[]) RETURNS TABLE ("id" INTEGER, "title" "length_d", "from" "length_d", "to" "length_d", "departure_date" TIMESTAMPTZ, "arrival_date" TIMESTAMPTZ, "budget" INTEGER, "number_of_travelers" INTEGER, "organizer_id" INTEGER, "created_at" TIMESTAMPTZ, "updated_at" TIMESTAMPTZ, "traveler_id" INTEGER) AS $$
BEGIN
  RETURN QUERY 
  SELECT "travel".*, "has_travelers"."traveler_id" FROM "travel"
  JOIN "has_travelers" ON "has_travelers"."travel_id" = "travel"."id"
  WHERE "has_travelers"."traveler_id" = ANY(func_traveler_id);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER set_slug_based_on_title_and_id ON "travel";

DROP FUNCTION set_slug_based_on_title_and_id();

ALTER TABLE "travel" DROP COLUMN "slug";

COMMIT;
