"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userNew.json");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../tokens");
const { BadRequestError } = require("../expressError");
const multer = require("multer");
const upload = multer();

const DEFAULT_PHOTO = 'https://i.pinimg.com/originals/33/70/29/33702949116bc77168dd93bdecc9f955.png';

/** Register user. */
router.post("/register", upload.single('file'), async (req, res, next) => {
  const userData = JSON.parse(JSON.stringify(req.body));

  userData.radius === "" ? userData.radius = 25 : userData.radius = +userData.radius;
  req.file ? userData.photo = await User.handlePhoto(req.file) : userData.photo = DEFAULT_PHOTO;
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