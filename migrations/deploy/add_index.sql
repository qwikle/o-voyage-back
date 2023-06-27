-- Deploy api:add_index to pg

BEGIN;

CREATE INDEX idx_travel ON "has_travelers" ("travel_id");
CREATE INDEX idx_travelers ON "has_travelers" ("traveler_id");

CREATE INDEX idx_categories ON "activity" ("category_id");
CREATE INDEX idx_categories_travel_by_date ON "activity" ("travel_id", "date");

COMMIT;
