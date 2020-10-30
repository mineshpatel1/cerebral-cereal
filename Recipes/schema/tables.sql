CREATE TABLE IF NOT EXISTS ingredients (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR,
    plural              VARCHAR,
    category_id         INTEGER,
    unit_id             INTEGER,
    unit_size           INTEGER,
    location_id         INTEGER,
    image_url           VARCHAR,
    image_aspect_ratio  NUMERIC(10, 5),
    api_id              INTEGER
);
CREATE INDEX ingredients_id_idx ON ingredients (id);