"use strict";

const db = require("../db.js");

const User = require("./user.js");

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

/** Authenticate. */
describe("authenticate", function () {
  test("valid credentials return user", async function () {
    const user = await User.authenticate({ username: "u1", password: "password"});

    expect(user).toEqual({
      username: "u1",
      name: "u1",
      email: "u1@email.com",
      dob: "2001-06-13",
      photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
      zip: '92704',
      latlng: '33.74465,-117.93119',
      radius: 25,
      bio: null,
    });
  });

  test("invalid username returns unauth error", async function () {
    try {
      await User.authenticate({ username: "u3", password: "password" });
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("invalid password returns unauth error", async function () {
    try {
      await User.authenticate({ username: "u1", password: "wrong"});
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/** Register. */
describe("register", function () {
  const u3 = {
    username: "u3",
    name: "u3",
    email: "u3@email.com",
    dob: "1994-04-17",
    photo: 'https://colossal.com/wp-content/uploads/dodo-Header-blog.jpg',
    zip: '90802',
    latlng: '33.76672,-118.1924',
    radius: 5000,
    bio: "meow",
  };

  test("valid data returns user", async function () {
    let user = await User.register({
      ...u3,
      password: "password",
    });

    expect(user).toEqual(u3);

    const found = await db.query("SELECT * FROM users WHERE username = 'u3'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("dupe data returns bad request error", async function () {
    try {
      await User.register({
        ...u3,
        password: "password",
      });
      await User.register({
        ...u3,
        password: "password",
      });
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("underage user returns bad request error", async function () {
    try {
      await User.register({
        username: "u3",
        password: "password",
        name: "u3",
        email: "u3@email.com",
        dob: "2014-04-17",
        photo: 'https://colossal.com/wp-content/uploads/dodo-Header-blog.jpg',
        zip: '90802',
        latlng: '33.76672,-118.1924',
        radius: 5000,
        bio: "meow",
      });
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/** Get all. */
describe("getAll", function () {
  test("returns all users", async function () {
    const users = await User.getAll();

    expect(users.length).toEqual(2);
    expect(["u1", "u2"]).toContain(users[0].username);
    expect(["u1", "u2"]).toContain(users[1].username);
  });
});

/** Get. */
describe("get", function () {
  test("valid username returns user", async function () {
    let user = await User.get("u1");

    expect(user).toEqual({
      username: "u1",
      name: "u1",
      email: "u1@email.com",
      dob: "2001-06-13",
      photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
      zip: '92704',
      latlng: '33.74465,-117.93119',
      radius: 25,
      bio: null,
    });
  });

  test("invalid username returns not found error", async function () {
    try {
      await User.get("u3");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** Update. */
describe("update", function () {
  const updateData = {
    name: "u3",
    email: "u3@email.com",
  };

  test("valid data returns updated user", async function () {
    let user = await User.update("u1", updateData);

    expect(user).toEqual({
      username: "u1",
      name: "u3",
      email: "u3@email.com",
      dob: "2001-06-13",
      photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
      zip: '92704',
      latlng: '33.74465,-117.93119',
      radius: 25,
      bio: null,
    });
  });

  test("new password returns user", async function () {
    let user = await User.update("u1", {
      password: "new",
    });

    expect(user).toEqual({
      username: "u1",
      name: "u1",
      email: "u1@email.com",
      dob: "2001-06-13",
      photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
      zip: '92704',
      latlng: '33.74465,-117.93119',
      radius: 25,
      bio: null,
    });

    const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("invalid username returns not found error", async function () {
    try {
      await User.update("u3", {
        name: "u3",
      });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});