"use strict";

/** User routes. */

const jsonschema = require("jsonschema");
const userUpdateSchema = require("../schemas/userUpdate.json");

const express = require("express");
const router = express.Router();

/** Middleware to handle file uploads. */
const multer = require("multer");
const upload = multer();

const User = require("../models/user");

const { BadRequestError } = require("../expressError");

/** Upload file (access via req.file) to S3 bucket and return image URL. */
router.post("/upload", upload.single('file'), async (req, res, next) => {
  const imageUrl = await User.uploadPhoto(req.file);

  return res.json({ imageUrl });
})

/** Get all users. */
router.get("/", async (req, res, next) => {
  const users = await User.getAll();

  return res.json(users);
})

/** Get a user. */
router.get("/:username", async function (req, res, next) {
  const user = await User.get(req.params.username);

  return res.json({ user });
});

/** Update a user. */
router.patch("/:username", async function (req, res, next) {
  // Ensure credentials are valid
  await User.authenticate({ username: req.params.username, password: req.body.password });

  // Logic for updating password
  if (req.body.newPassword) {
    req.body.password = req.body.newPassword;
    delete req.body.newPassword;

    const user = await User.update(req.params.username, req.body);

    return res.json({ user });
  }

  // Handle empty input for radius
  req.body.radius === "" ? req.body.radius = 25 : req.body.radius = +req.body.radius;

  const validator = jsonschema.validate(
      req.body,
      userUpdateSchema,
      { required: true },
  );

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  delete req.body.password;

  const user = await User.update(req.params.username, req.body);

  return res.json({ user });
});

module.exports = router;