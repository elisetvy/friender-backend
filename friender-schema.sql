-- Schema for tables in friender and friender_test databases.

CREATE TABLE users (
  username VARCHAR(30) PRIMARY KEY,
  password VARCHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  dob VARCHAR(10) NOT NULL,
  photo TEXT NOT NULL,
  zip VARCHAR(5) NOT NULL,
  latlng TEXT NOT NULL,
  radius INTEGER NOT NULL,
  bio TEXT
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
  receiver TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
  body TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);