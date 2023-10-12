require("dotenv").config();

const express = require("express");
const app = express();

const bcrypt = require("bcrypt");

const multer = require("multer");
const upload = multer();

const { BCRYPT_WORK_FACTOR } = require("./config");
const { NotFoundError } = require("./expressError");

const User = require("./models/user");
const cors = require("cors")

app.use(cors());
app.use(express.json());

/** Register a cat. */
app.post("/register", upload.single('file'), async (req, res, next) => {
  const userData = JSON.parse(JSON.stringify(req.body));
  const user = await User.register(userData);
  const imageUrl = await User.handleProfilePic(user.username, req.file);
  console.log(`imageURl is `, imageUrl);
  user.profilePic = imageUrl;

  console.log(`user about to be sent back is ,`, user);
  return res.json(user);
});

/** Uploads file to S3 bucket and returns image URL. */
app.post("/upload", upload.single('file'), async (req, res, next) => {
  const imageUrl = await User.handlePhotoData(req.file);

  return res.json({ imageUrl });
})



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