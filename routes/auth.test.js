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

/** Register. */
describe("POST /auth/register", function () {
  test("valid data returns token", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "u3",
          password: "password",
          name: "u3",
          email: "u3@email.com",
          dob: "1994-04-17",
          photo: 'https://colossal.com/wp-content/uploads/dodo-Header-blog.jpg',
          zip: '90802',
          radius: 5000,
          bio: "meow",
        });
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("missing optional fields returns token", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "u3",
          password: "password",
          name: "u3",
          email: "u3@email.com",
          dob: "1994-04-17",
          photo: 'https://colossal.com/wp-content/uploads/dodo-Header-blog.jpg',
          zip: '90802',
          radius: 5000,
        });
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("missing required fields returns bad request error", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "u3",
          password: "password",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("invalid data returns bad request error", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({
          username: 123,
          password: 567,
        });
    expect(resp.statusCode).toEqual(400);
  });
});

/** Log in. */
describe("POST /auth/login", function () {
  test("valid data returns token", async function () {
    const resp = await request(app)
        .post("/auth/login")
        .send({
          username: "u1",
          password: "password"
        });
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("missing data returns bad request error", async function () {
    const resp = await request(app)
        .post("/auth/login")
        .send({
          username: "u1"
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("invalid data returns unauth error", async function () {
    const resp = await request(app)
        .post("/auth/login")
        .send({
          username: "u1",
          password: "wrong"
        });
    expect(resp.statusCode).toEqual(401);
  });
});