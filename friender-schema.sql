CREATE TABLE users (
  username VARCHAR(20) PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  zip_code VARCHAR(5) NOT NULL,
  friend_radius INTEGER NOT NULL,
  hobbies TEXT,
  interests TEXT
);

CREATE TABLE photos (
  username VARCHAR(20) NOT NULL
    REFERENCES users(username),
  photo_profile VARCHAR(100) NOT NULL DEFAULT 'https://friender-bucket-79.s3.us-west-2.amazonaws.com/default-user.jpg',
  photo_one VARCHAR(100),
  photo_two VARCHAR(100),
  photo_three VARCHAR(100),
  photo_four VARCHAR(100),
  photo_five VARCHAR(100)
)