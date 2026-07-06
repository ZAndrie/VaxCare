-- VaxCare database schema
-- Run with: psql -U <user> -d <database> -f src/db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name  VARCHAR(100) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'worker', 'resident')),
  resident_id   VARCHAR(20),              -- only set when role = 'resident'
  avatar        VARCHAR(5),
  title         VARCHAR(100),
  created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS residents (
  id         VARCHAR(20) PRIMARY KEY,      -- e.g. 'R001'
  name       VARCHAR(150) NOT NULL,
  age        INTEGER NOT NULL,
  gender     VARCHAR(20) NOT NULL,
  birthdate  DATE NOT NULL,
  address    VARCHAR(200),
  phone      VARCHAR(20),
  purok      VARCHAR(50),
  status     VARCHAR(30) NOT NULL DEFAULT 'Unvaccinated'
             CHECK (status IN ('Fully Vaccinated', 'Partially Vaccinated', 'Unvaccinated')),
  next_due   DATE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id          SERIAL PRIMARY KEY,
  resident_id VARCHAR(20) NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  vaccine     VARCHAR(100) NOT NULL,
  dose        VARCHAR(50) NOT NULL,
  date        DATE NOT NULL,
  worker      VARCHAR(100),
  batch_no    VARCHAR(50),
  site        VARCHAR(50),
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vaccine_stock (
  id              VARCHAR(20) PRIMARY KEY,  -- e.g. 'VS001'
  name            VARCHAR(100) NOT NULL,
  type            VARCHAR(50),
  quantity        INTEGER NOT NULL DEFAULT 0,
  min_stock       INTEGER NOT NULL DEFAULT 0,
  expiry_date     DATE,
  manufacturer    VARCHAR(100),
  last_restocked  DATE
);

CREATE TABLE IF NOT EXISTS schedules (
  id             VARCHAR(20) PRIMARY KEY,   -- e.g. 'S001'
  resident_id    VARCHAR(20) NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  vaccine        VARCHAR(100) NOT NULL,
  dose           VARCHAR(50) NOT NULL,
  scheduled_date DATE NOT NULL,
  status         VARCHAR(20) NOT NULL DEFAULT 'Upcoming'
                 CHECK (status IN ('Upcoming', 'Completed', 'Missed', 'Rescheduled')),
  worker         VARCHAR(100),
  purok          VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  type       VARCHAR(20) NOT NULL CHECK (type IN ('alert', 'info', 'warning', 'success')),
  title      VARCHAR(150) NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vaccinations_resident ON vaccinations(resident_id);
CREATE INDEX IF NOT EXISTS idx_schedules_resident ON schedules(resident_id);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules(status);
