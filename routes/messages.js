"use strict";

const Router = require("express").Router;
const router = new Router();
const { UnauthorizedError, BadRequestError } = require("../expressError");
const Message = require("../models/message");

/** Send a message. */

router.post("/", async function(req, res, next) {
  if (!req.body) throw new BadRequestError();

  const { sender, receiver, body } = req.body;

  const message = await Message.send({ sender, receiver, body });

  return res.json({ message });
});

/** Get messages between users. */

router.get("/:u1/:u2", async function(req, res, next) {
  const { u1, u2 } = req.params;

  const messages = await Message.get({ u1, u2 });

  return res.json({ messages })
});

module.exports = router;