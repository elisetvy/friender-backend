"use strict";

const db = require("../db.js");

const User = require("../models/user");
const Message = require("../models/message");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM messages");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await User.register(
      {
        username: "u1",
        password: "password",
        name: "u1",
        email: "u1@email.com",
        dob: "2001-06-13",
        photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
        zip: '92704',
        radius: 25,
        bio: null,
      });
  await User.register(
      {
        username: "u2",
        password: "password",
        name: "u2",
        email: "u2@email.com",
        dob: "1993-09-17",
        photo: 'https://i.pinimg.com/736x/24/1f/49/241f49ca612ef379a78fdcf7b8471ada.jpg',
        zip: '90802',
        radius: 2000,
        bio: null,
      });

  await Message.send(
      {
        sender: "u1",
        receiver: "u2",
        body: "hi u2"
      });
  await Message.send(
      {
        sender: "u2",
        receiver: "u1",
        body: "hi u1"
      });
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
