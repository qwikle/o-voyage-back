-- Deploy api:indexation to pg

BEGIN;

CREATE INDEX idx_travels ON "travel" ("organizer_id");

CREATE INDEX idx_activities ON "activity" ("travel_id");

-- function to retrieve travelers of a travels

ALTER TABLE "has_travelers" RENAME COLUMN "attendee_id" TO "traveler_id";
CREATE FUNCTION get_travelers(func_travel_id integer[]) RETURNS 
 TABLE ("id" INTEGER, "firstname" TEXT, "lastname" TEXT, "email" "email_d", "travel_id" INTEGER) AS $$
BEGIN
  RETURN  QUERY 
  SELECT "user"."id", "user"."firstname", "user"."lastname" ,"user"."email", "has_travelers"."travel_id" FROM "user"
   JOIN "has_travelers" ON "has_travelers"."traveler_id" = "user"."id"
  WHERE "has_travelers"."travel_id" = ANY(func_travel_id);
END;
$$ LANGUAGE plpgsql;

-- function to retrieves travels of a traveler

CREATE FUNCTION get_travels(func_traveler_id integer[]) RETURNS SETOF "travel" AS $$
BEGIN
  RETURN QUERY 
  SELECT "travel".* FROM "travel"
  JOIN "has_travelers" ON "has_travelers"."travel_id" = "travel"."id"
  WHERE "has_travelers"."traveler_id" = ANY(func_traveler_id);
END;
$$ LANGUAGE plpgsql;

-- function to retrieve one traveler of a travel

CREATE FUNCTION get_one_traveler(func_traveler_id integer, func_travel_id integer) RETURNS TABLE ("id" INTEGER, "firstname" TEXT, "lastname" TEXT, "email" "email_d") AS $$
BEGIN
  RETURN QUERY 
  SELECT "user"."id", "user"."firstname", "user"."lastname", "user"."email" FROM "user"
  JOIN "has_travelers" ON "has_travelers"."traveler_id" = "user"."id"
  WHERE "has_travelers"."travel_id" = func_travel_id AND "has_travelers"."traveler_id" = func_traveler_id;
END;
$$ LANGUAGE plpgsql;


-- rename column "traveler_id" to "traveler_id" in table "has_travelers"



COMMIT;
