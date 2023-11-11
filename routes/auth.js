"use strict";

/** Routes for authentication. */

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../tokens");
const { BadRequestError } = require("../expressError");
const multer = require("multer");
const upload = multer();

/** Register user. */
router.post("/register", upload.single('file'), async (req, res, next) => {
  const userData = JSON.parse(JSON.stringify(req.body));

  let user;

  if (req.file) {
    const imageUrl = await User.handlePhoto(req.file);
    userData.photo = imageUrl;

    user = await User.register(userData);
  } else {
    user = await User.register(userData);
  }

  const token = createToken(user)

  return res.json({ token });
});


router.post("/login",  async (req, res, next) => {
  const user = await User.authenticate(req.body);
  const token = createToken(user);

  return res.json({ token });
});

module.exports = router;