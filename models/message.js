"use strict";

/** Message class for friender. */

const { NotFoundError } = require("../expressError");
const db = require("../db");

class Message {

  /** Insert new message into database. */

  static async send({ sender, receiver, body }) {
    const result = await db.query(
          `INSERT INTO messages (sender,
                                 receiver,
                                 body)
             VALUES
               ($1, $2, $3)
             RETURNING sender, receiver, body, timestamp`,
        [sender, receiver, body]);

    return result.rows[0];
  }

  /** Get messages between users. */

  static async get({ u1, u2 }) {
    const result = await db.query(
          `SELECT sender,
                receiver,
                body,
                timestamp
          FROM messages
          WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)
          ORDER BY timestamp ASC`,
    [u1, u2]);

    const messages = result.rows;

    if (!messages) throw new NotFoundError(`No messages between ${u1} and ${u2}.`);

    return messages;
  }
}


module.exports = Message;