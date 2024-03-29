"use strict";

/** Message class. */

const db = require("../db");

const { NotFoundError } = require("../expressError");

class Message {
  /** Insert new message into database. */
  static async send({ sender, receiver, body }) {
    const result = await db.query(`
                INSERT INTO messages
                    (sender,
                    receiver,
                    body)
                VALUES ($1, $2, $3)
                RETURNING
                    id,
                    sender,
                    receiver,
                    body,
                    timestamp`, [
                    sender,
                    receiver,
                    body
                    ]
      );

    return result.rows[0];
  }

  /** Get messages between users. */
  static async get({ u1, u2 }) {
    // TODO: handle unvalid usernames

    const result = await db.query(`
                SELECT
                    id,
                    sender,
                    receiver,
                    body,
                    timestamp
                FROM messages
                WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)
                ORDER BY timestamp ASC`, [u1, u2]
    );

    const messages = result.rows;

    if (!messages) throw new NotFoundError(`No messages between ${u1} and ${u2}.`);

    return messages;
  }

  /** Get a user's messages.
   *
   * If user is sender, return receiver.
   * If user is receiver, return sender.
   *
  */
  static async getUserMessages(username) {
    const result = await db.query(`
                SELECT DISTINCT ON (username)
                CASE
                    WHEN sender = $1 THEN receiver
                    WHEN receiver = $1 THEN sender
                END AS
                    username,
                    id,
                    timestamp,
                    body
                FROM messages
                WHERE sender = $1 OR receiver = $1
                ORDER BY username, timestamp DESC`,[username]
    );

    // Sort messages by most recent
    const messages = result.rows.sort((a, b) => b.timestamp - a.timestamp);

    if (!messages) throw new NotFoundError(`${username} doesn't have any messages`);

    return messages;
  }
}

module.exports = Message;