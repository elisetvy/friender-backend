"use strict";

const db = require("../db.js");

const Message = require("./message.js");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** Send. */
describe("send", function () {
  test("valid data returns message", async function () {
    const message = await Message.send({ sender : "u1", receiver: "u2", body: "hi again" });

    expect(message).toEqual({
      id: expect.any(Number),
      sender: "u1",
      receiver: "u2",
      body: "hi again",
      timestamp: expect.any(Date)
    });
  });
});

/** Get messages between users. */
describe("get", function () {
  test("valid data returns messages array", async function () {
    const messages = await Message.get({ u1: "u1", u2: "u2" });

    expect(messages.length).toEqual(2);
    expect(messages).toEqual([
      {
        id: expect.any(Number),
        sender: "u1",
        receiver: "u2",
        body: "hi u2",
        timestamp: expect.any(Date)
      },
      {
        id: expect.any(Number),
        sender: "u2",
        receiver: "u1",
        body: "hi u1",
        timestamp: expect.any(Date)
      }
    ]);
  });

  test("valid data but no messages returns not found err", async function () {
    try {
      await Message.get({ u1: "u1", u2: "u1" })
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** Get a user's messages. */
describe("getUserMessages", function () {
  test("valid username returns messages array", async function () {
    const messages = await Message.getUserMessages("u1");

    expect(messages).toEqual([
      {
        username: "u2",
        id: expect.any(Number),
        body: "hi u1",
        timestamp: expect.any(Date)
      },
    ]);
  });
});