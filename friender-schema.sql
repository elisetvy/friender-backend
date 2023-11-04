CREATE TABLE users (
  username VARCHAR(20) PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  fname VARCHAR(20) NOT NULL,
  lname VARCHAR(20) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  photo TEXT NOT NULL,
  zip VARCHAR(5) NOT NULL,
  radius INTEGER NOT NULL DEFAULT 25,
  bio TEXT
);