"use strict";

const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const User = require("../models/user");
const { BadRequestError } = require("../expressError");

/** Upload file to S3 bucket and return image URL. */
router.post("/upload", upload.single('file'), async (req, res, next) => {
  const imageUrl = await User.handlePhoto(req.file);

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

module.exports = router;