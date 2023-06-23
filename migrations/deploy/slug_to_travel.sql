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

COMMIT;
