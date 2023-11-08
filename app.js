require("dotenv").config();

const express = require("express");
const app = express();

const bcrypt = require("bcrypt");

const multer = require("multer");
const upload = multer();

const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("./config");
const { NotFoundError } = require("./expressError");

const jwt = require("jsonwebtoken");

const User = require("./models/user");
const { createToken } = require("./tokens");

const cors = require("cors")

app.use(cors());
app.use(express.json());

/** Register user. */
app.post("/register", upload.single('file'), async (req, res, next) => {
  const userData = JSON.parse(JSON.stringify(req.body));
  let user;

  if (req.file) {
    const imageUrl = await User.handlePhoto(user.username, req.file);
    userData.photo = imageUrl;

    user = await User.register(userData);
  } else {
    user = await User.register(userData);
  }

  const token = createToken(user)

  return res.json({ token });
});

/** Upload file to S3 bucket and return image URL. */
app.post("/upload", upload.single('file'), async (req, res, next) => {
  const imageUrl = await User.handlePhoto(req.file);

  return res.json({ imageUrl });
})

app.post("/login",  async (req, res, next) => {
  const user = await User.authenticate(req.body);
  const token = createToken(user);

  return res.json({ token });
})

/** Get all users. */
app.get("/users", async (req, res, next) => {
  const users = await User.getAll();

  return res.json(users);
})

/** Get a user. */
app.get("/users/:username", async function (req, res, next) {
  const user = await User.get(req.params.username);
  return res.json({ user });
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  /* istanbul ignore next (ignore for coverage) */
  const status= err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;