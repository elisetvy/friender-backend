require("dotenv").config();

const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();

const { NotFoundError } = require("./expressError");

const User = require("./models/user");

app.use(express.json());

/** Uploads file to S3 bucket and returns image URL. */
app.post("/", upload.single('file'), (req, res, next) => {
  console.log(req.file, "REQ FILE")
  const imageUrl = User.handlePhotoData(req.file.buffer);
  console.log(imageUrl, "IMAGE URL")

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