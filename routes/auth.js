"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");

const express = require("express");
const router = new express.Router();

/** Middleware to handle file uploads. */
const multer = require("multer");
const upload = multer();

const { createToken } = require("../tokens");

const User = require("../models/user");

const { BadRequestError } = require("../expressError");

const DEFAULT_PHOTO = 'https://i.pinimg.com/originals/33/70/29/33702949116bc77168dd93bdecc9f955.png';
const DEFAULT_RADIUS = 25;

/** Register a user. Access photo upload via req.file. */
router.post("/register", upload.single('file'), async (req, res, next) => {
  const userData = JSON.parse(JSON.stringify(req.body)); // Creates copy of req.body

  userData.radius === "" ? userData.radius = DEFAULT_RADIUS : userData.radius = +userData.radius;

  req.file ? userData.photo = await User.uploadPhoto(req.file) : userData.photo = DEFAULT_PHOTO;
  delete userData.file;

  const validator = jsonschema.validate(
    userData,
    userRegisterSchema,
    {required: true}
    );

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const user = await User.register(userData);
  const token = createToken(user)

  return res.json({ token });
});

/** Log in a user. */
router.post("/login",  async (req, res, next) => {
  const validator = jsonschema.validate(
    req.body,
    userAuthSchema,
    {required: true}
  );

  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const user = await User.authenticate(req.body);
  const token = createToken(user);

  return res.json({ token });
});

module.exports = router;