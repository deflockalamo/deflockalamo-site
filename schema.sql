-- deflockalamo-site / D1 schema
-- Run this ONCE to initialize the database. Idempotent - safe to re-run.

CREATE TABLE IF NOT EXISTS survey_responses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  answer      TEXT    NOT NULL CHECK(answer IN ('yes','some','no','learn')),
  source      TEXT    NOT NULL DEFAULT 'survey-page',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_survey_created ON survey_responses(created_at);

CREATE TABLE IF NOT EXISTS standing_list (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name  TEXT    NOT NULL,
  last_name   TEXT    NOT NULL,
  email       TEXT,
  comment     TEXT,
  residency   TEXT    NOT NULL CHECK(residency IN ('alamogordo','regional')),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_standing_residency ON standing_list(residency, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_standing_created ON standing_list(created_at DESC);

CREATE TABLE IF NOT EXISTS email_subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL UNIQUE,
  first_name  TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created ON email_subscribers(created_at);
