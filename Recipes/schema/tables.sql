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

CREATE TYPE recipe_ingredient AS (
    ingredient_id       INTEGER,
    quantity            INTEGER,
    unit_id             INTEGER
);

CREATE TABLE IF NOT EXISTS recipes (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR,
    cuisine_id          INTEGER,
    serving_size        INTEGER,
    method              VARCHAR[],
    ingredients         recipe_ingredient[]
);
CREATE INDEX recipes_id_idx ON recipes (id);
