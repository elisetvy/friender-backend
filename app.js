require("dotenv").config();

const express = require("express");
const app = express();

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const messagesRoutes = require("./routes/messages");

const { NotFoundError } = require("./expressError");

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/auth", usersRoutes);
app.use("/users", usersRoutes);
app.use("/messages", messagesRoutes);

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