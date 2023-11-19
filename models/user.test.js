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

  test("no such user returns unauth error", async function () {
    try {
      await User.authenticate({ username: "u3", password: "password" });
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("wrong password returns unauth error", async function () {
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

    expect(users).toEqual([
      {
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
      {
        username: "u2",
        name: "u2",
        email: "u2@email.com",
        dob: "1993-09-17",
        photo: 'https://i.pinimg.com/736x/24/1f/49/241f49ca612ef379a78fdcf7b8471ada.jpg',
        zip: '90802',
        latlng: '33.76672,-118.1924',
        radius: 2000,
        bio: null,
      },
    ]);
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

/** Update */

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

  // test("works: set password", async function () {
  //   let job = await User.update("u1", {
  //     password: "new",
  //   });
  //   expect(job).toEqual({
  //     username: "u1",
  //     firstName: "U1F",
  //     lastName: "U1L",
  //     email: "u1@email.com",
  //     isAdmin: false,
  //   });
  //   const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
  //   expect(found.rows.length).toEqual(1);
  //   expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  // });

  // test("not found if no such user", async function () {
  //   try {
  //     await User.update("nope", {
  //       firstName: "test",
  //     });
  //     throw new Error("fail test, you shouldn't get here");
  //   } catch (err) {
  //     expect(err instanceof NotFoundError).toBeTruthy();
  //   }
  // });

  // test("bad request if no data", async function () {
  //   expect.assertions(1);
  //   try {
  //     await User.update("c1", {});
  //     throw new Error("fail test, you shouldn't get here");
  //   } catch (err) {
  //     expect(err instanceof BadRequestError).toBeTruthy();
  //   }
  // });
});

// /************************************** remove */

// describe("remove", function () {
//   test("works", async function () {
//     await User.remove("u1");
//     const res = await db.query(
//         "SELECT * FROM users WHERE username='u1'");
//     expect(res.rows.length).toEqual(0);
//   });

//   test("not found if no such user", async function () {
//     try {
//       await User.remove("nope");
//       throw new Error("fail test, you shouldn't get here");
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });

// /************************************** applyToJob */

// describe("applyToJob", function () {
//   test("works", async function () {
//     await User.applyToJob("u1", testJobIds[1]);

//     const res = await db.query(
//         "SELECT * FROM applications WHERE job_id=$1", [testJobIds[1]]);
//     expect(res.rows).toEqual([{
//       job_id: testJobIds[1],
//       username: "u1",
//     }]);
//   });

//   test("not found if no such job", async function () {
//     try {
//       await User.applyToJob("u1", 0, "applied");
//       throw new Error("fail test, you shouldn't get here");
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("not found if no such user", async function () {
//     try {
//       await User.applyToJob("nope", testJobIds[0], "applied");
//       throw new Error("fail test, you shouldn't get here");
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });
