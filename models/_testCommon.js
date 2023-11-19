"use strict";

const { BCRYPT_WORK_FACTOR } = require("../config");
const bcrypt = require("bcrypt");

const db = require("../db.js");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM messages");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
      INSERT INTO users (username,
                        password,
                        name,
                        email,
                        dob,
                        photo,
                        zip,
                        latlng,
                        radius)
      VALUES ('u1', $1, 'u1', 'u1@email.com', '2001-06-13', 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=', '92704', '33.74465,-117.93119', 25),
             ('u2', $2, 'u2', 'u2@email.com', '1993-09-17', 'https://i.pinimg.com/736x/24/1f/49/241f49ca612ef379a78fdcf7b8471ada.jpg', '90802', '33.76672,-118.1924', 2000)
      RETURNING username`, [
    await bcrypt.hash("password", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password", BCRYPT_WORK_FACTOR),
  ]);

  await db.query(`
      INSERT INTO messages (id,
                           sender,
                           receiver,
                           body,
                           timestamp)
      VALUES (1, 'u1', 'u2', 'hi u2', '2023-11-11 23:11:17.219203-08'),
             (2, 'u2', 'u1', 'hi u1', '2023-11-11 23:11:17.219203-08')
      RETURNING body`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};