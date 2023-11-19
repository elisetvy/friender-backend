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
  test("works", async function () {
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

  // test("unauth if no such user", async function () {
  //   try {
  //     await User.authenticate("u3", "password");
  //     throw new Error("fail test, you shouldn't get here");
  //   } catch (err) {
  //     expect(err instanceof UnauthorizedError).toBeTruthy();
  //   }
  // });

  // test("unauth if wrong password", async function () {
  //   try {
  //     await User.authenticate("c1", "wrong");
  //     throw new Error("fail test, you shouldn't get here");
  //   } catch (err) {
  //     expect(err instanceof UnauthorizedError).toBeTruthy();
  //   }
  // });
});

// /************************************** register */

// describe("register", function () {
//   const newUser = {
//     username: "new",
//     firstName: "Test",
//     lastName: "Tester",
//     email: "test@test.com",
//     isAdmin: false,
//   };

//   test("works", async function () {
//     let user = await User.register({
//       ...newUser,
//       password: "password",
//     });
//     expect(user).toEqual(newUser);
//     const found = await db.query("SELECT * FROM users WHERE username = 'new'");
//     expect(found.rows.length).toEqual(1);
//     expect(found.rows[0].is_admin).toEqual(false);
//     expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
//   });

//   test("works: adds admin", async function () {
//     let user = await User.register({
//       ...newUser,
//       password: "password",
//       isAdmin: true,
//     });
//     expect(user).toEqual({ ...newUser, isAdmin: true });
//     const found = await db.query("SELECT * FROM users WHERE username = 'new'");
//     expect(found.rows.length).toEqual(1);
//     expect(found.rows[0].is_admin).toEqual(true);
//     expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
//   });

//   test("bad request with dup data", async function () {
//     try {
//       await User.register({
//         ...newUser,
//         password: "password",
//       });
//       await User.register({
//         ...newUser,
//         password: "password",
//       });
//       throw new Error("fail test, you shouldn't get here");
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

// /************************************** findAll */

// describe("findAll", function () {
//   test("works", async function () {
//     const users = await User.findAll();
//     expect(users).toEqual([
//       {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "u1@email.com",
//         isAdmin: false,
//       },
//       {
//         username: "u2",
//         firstName: "U2F",
//         lastName: "U2L",
//         email: "u2@email.com",
//         isAdmin: false,
//       },
//     ]);
//   });
// });

// /************************************** get */

// describe("get", function () {
//   test("works", async function () {
//     let user = await User.get("u1");
//     expect(user).toEqual({
//       username: "u1",
//       firstName: "U1F",
//       lastName: "U1L",
//       email: "u1@email.com",
//       isAdmin: false,
//       applications: [testJobIds[0]],
//     });
//   });

//   test("not found if no such user", async function () {
//     try {
//       await User.get("nope");
//       throw new Error("fail test, you shouldn't get here");
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });

// /************************************** update */

// describe("update", function () {
//   const updateData = {
//     firstName: "NewF",
//     lastName: "NewF",
//     email: "new@email.com",
//     isAdmin: true,
//   };

//   test("works", async function () {
//     let job = await User.update("u1", updateData);
//     expect(job).toEqual({
//       username: "u1",
//       ...updateData,
//     });
//   });

//   test("works: set password", async function () {
//     let job = await User.update("u1", {
//       password: "new",
//     });
//     expect(job).toEqual({
//       username: "u1",
//       firstName: "U1F",
//       lastName: "U1L",
//       email: "u1@email.com",
//       isAdmin: false,
//     });
//     const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
//     expect(found.rows.length).toEqual(1);
//     expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
//   });

//   test("not found if no such user", async function () {
//     try {
//       await User.update("nope", {
//         firstName: "test",
//       });
//       throw new Error("fail test, you shouldn't get here");
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("bad request if no data", async function () {
//     expect.assertions(1);
//     try {
//       await User.update("c1", {});
//       throw new Error("fail test, you shouldn't get here");
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

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