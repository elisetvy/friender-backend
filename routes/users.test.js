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

/** GET /users. */
describe("GET /users", function () {
  test("returns array of users", async function () {
    const resp = await request(app)
        .get("/users");

  expect(resp.body.length).toEqual(2);
  expect(["u1", "u2"]).toContain(resp.body[0].username);
  expect(["u1", "u2"]).toContain(resp.body[1].username);
  });
});

/** GET /users/:username. */
describe("GET /users/:username", function () {
  test("valid username returns user", async function () {
    const resp = await request(app)
        .get(`/users/u1`);

    expect(resp.body).toEqual({
      user: {
        username: "u1",
        name: "u1",
        email: "u1@email.com",
        dob: "2001-06-13",
        photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
        zip: '92704',
        latlng: '33.74465,-117.93119',
        radius: 25,
        bio: null,
      },
    });
  });

  test("invalid username returns not found error", async function () {
    const resp = await request(app)
        .get(`/users/u3`);

    expect(resp.statusCode).toEqual(404);
  });
});

/** PATCH /users/:username. */
describe("PATCH /users/:username", () => {
  test("valid data returns user", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          password: "password",
          radius: 1000,
        });

    expect(resp.body).toEqual({
      user: {
        username: "u1",
        name: "u1",
        email: "u1@email.com",
        dob: "2001-06-13",
        photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
        zip: '92704',
        latlng: '33.74465,-117.93119',
        radius: 1000,
        bio: null,
      },
    });
  });

  test("empty radius input defaults to 25 and returns user", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          password: "password",
          radius: "",
        });

    expect(resp.body).toEqual({
      user: {
        username: "u1",
        name: "u1",
        email: "u1@email.com",
        dob: "2001-06-13",
        photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
        zip: '92704',
        latlng: '33.74465,-117.93119',
        radius: 25,
        bio: null,
      },
    });
  });

  test("valid new password returns user", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          password: "password",
          newPassword: "new",
        });

    expect(resp.body).toEqual({
      user: {
        username: "u1",
        name: "u1",
        email: "u1@email.com",
        dob: "2001-06-13",
        photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
        zip: '92704',
        latlng: '33.74465,-117.93119',
        radius: 25,
        bio: null,
      },
    });
  });

  test("invalid credentials returns unauth error", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          password: "wrong",
          radius: 1000
        });

    expect(resp.statusCode).toEqual(401);
  });

  test("invalid data returns bad request error", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          password: "password",
          radius: "not a number"
        });

    expect(resp.statusCode).toEqual(400);
  });
});