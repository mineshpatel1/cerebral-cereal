-- Express cookie sessionisation (https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql)
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR NOT NULL UNIQUE,
    name            VARCHAR,
    created_time    BIGINT
);
CREATE INDEX users_id_idx ON users (id);
CREATE INDEX users_email_idx ON users (email);
