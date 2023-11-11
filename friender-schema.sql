CREATE TABLE users (
  username VARCHAR(20) PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  fname VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  dob VARCHAR(10) NOT NULL,
  photo TEXT NOT NULL,
  zip VARCHAR(5) NOT NULL,
  latlng TEXT NOT NULL,
  radius INTEGER NOT NULL,
  bio TEXT
);