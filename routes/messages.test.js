"use strict";

const request = require("supertest");

const app = require("../app");

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

/** POST /messages. */
describe("POST /messages", function () {
  test("valid data returns message", async function () {
    const resp = await request(app)
        .post("/messages")
        .send({
          sender: "u1",
          receiver: "u2",
          body: "hi again",
        });

    expect(resp.body).toEqual({
      message: {
        id: expect.any(Number),
        sender: "u1",
        receiver: "u2",
        body: "hi again",
        timestamp: expect.any(String),
      }
    });
  });

  test("no data returns bad request error", async function () {
    const resp = await request(app)
        .post("/messages");

    expect(resp.statusCode).toEqual(400);
  });
});

/** GET /messages/:u1/:u2. */
describe("GET /messages/:u1/:u2", function () {
  test("valid data returns array of messages", async function () {
    const resp = await request(app)
        .get("/messages/u1/u2");

    expect(resp.body.messages.length).toEqual(2)
    expect(["u1", "u2"]).toContain(resp.body.messages[0].sender);
    expect(["u1", "u2"]).toContain(resp.body.messages[1].sender);
  });
});

/** GET /messages/:username. */
describe("GET /messages/:username", function () {
  test("valid username returns array of messages", async function () {
    const resp = await request(app)
        .get("/messages/u1");

    expect(resp.body.messages.length).toEqual(1)
    expect(resp.body.messages[0].username).toEqual("u2");
    expect(resp.body.messages[0].body).toEqual("hi u1");
  });
});