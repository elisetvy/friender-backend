require("dotenv").config();

const express = require("express");
const app = express();

/** Middleware that allows cross origin requests. */
const cors = require("cors");
app.use(cors());

/** Middleware that parses JSON and makes it available at request.body. */
app.use(express.json());

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const messagesRoutes = require("./routes/messages");

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/messages", messagesRoutes);

const { NotFoundError } = require("./expressError");

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