-- Express cookie sessionisation
DROP TABLE IF EXISTS sessions;
CREATE TABLE "sessions" (
    "sid" VARCHAR NOT NULL COLLATE "default",
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR NOT NULL UNIQUE,
    name            VARCHAR NOT NULL UNIQUE,
    fingerprint_key VARCHAR,
    created_time    BIGINT
);
CREATE INDEX users_id_idx ON users (id);
CREATE INDEX users_email_idx ON users (email);
