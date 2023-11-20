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

/** Get. */
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

//   test("underage user returns bad request error", async function () {
//     try {
//       await User.register({
//         username: "u3",
//         password: "password",
//         name: "u3",
//         email: "u3@email.com",
//         dob: "2014-04-17",
//         photo: 'https://colossal.com/wp-content/uploads/dodo-Header-blog.jpg',
//         zip: '90802',
//         latlng: '33.76672,-118.1924',
//         radius: 5000,
//         bio: "meow",
//       });
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

// /** Get all. */

// describe("getAll", function () {
//   test("returns all users", async function () {
//     const users = await User.getAll();

//     expect(users).toEqual([
//       {
//         username: "u1",
//         name: "u1",
//         email: "u1@email.com",
//         dob: "2001-06-13",
//         photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
//         zip: '92704',
//         latlng: '33.74465,-117.93119',
//         radius: 25,
//         bio: null,
//       },
//       {
//         username: "u2",
//         name: "u2",
//         email: "u2@email.com",
//         dob: "1993-09-17",
//         photo: 'https://i.pinimg.com/736x/24/1f/49/241f49ca612ef379a78fdcf7b8471ada.jpg',
//         zip: '90802',
//         latlng: '33.76672,-118.1924',
//         radius: 2000,
//         bio: null,
//       },
//     ]);
//   });
// });

// /** Get. */

// describe("get", function () {
//   test("valid username returns user", async function () {
//     let user = await User.get("u1");

//     expect(user).toEqual({
//       username: "u1",
//       name: "u1",
//       email: "u1@email.com",
//       dob: "2001-06-13",
//       photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
//       zip: '92704',
//       latlng: '33.74465,-117.93119',
//       radius: 25,
//       bio: null,
//     });
//   });

//   test("invalid username returns not found error", async function () {
//     try {
//       await User.get("u3");
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });

// /** Update */

// describe("update", function () {
//   const updateData = {
//     name: "u3",
//     email: "u3@email.com",
//   };

//   test("valid data returns updated user", async function () {
//     let user = await User.update("u1", updateData);

//     expect(user).toEqual({
//       username: "u1",
//       name: "u3",
//       email: "u3@email.com",
//       dob: "2001-06-13",
//       photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
//       zip: '92704',
//       latlng: '33.74465,-117.93119',
//       radius: 25,
//       bio: null,
//     });
//   });

//   test("new password returns user", async function () {
//     let user = await User.update("u1", {
//       password: "new",
//     });

//     expect(user).toEqual({
//       username: "u1",
//       name: "u1",
//       email: "u1@email.com",
//       dob: "2001-06-13",
//       photo: 'https://media.istockphoto.com/id/155353122/photo/breaded-cat.jpg?s=612x612&w=0&k=20&c=T0xVGbkZIxHm1syWFx_5VxD5AeoTqMJtC8sBa3MDo-Y=',
//       zip: '92704',
//       latlng: '33.74465,-117.93119',
//       radius: 25,
//       bio: null,
//     });

//     const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
//     expect(found.rows.length).toEqual(1);
//     expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
//   });

//   test("invalid username returns not found error", async function () {
//     try {
//       await User.update("u3", {
//         name: "u3",
//       });
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });