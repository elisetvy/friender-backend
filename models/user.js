"use strict";

require("dotenv").config();

const db = require("../db");

const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const { sqlForPartialUpdate } = require("../utils");

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client({ region: process.env.BUCKET_REGION });
const uuid = require("uuid");

const { convertZip, calculateAge } = require("../utils");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class User {

  static async register(
    { username, password, name, email, dob, photo, zip, radius,
      bio }) {

    const duplicateCheck = await db.query(`
      SELECT username
      FROM users
      WHERE username = $1`, [username.toLowerCase()],
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`User already exists: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const latlng = await convertZip(zip);

    if (calculateAge(dob) < 18) throw new BadRequestError(`You must be at least 18 years old to register.`);

    const result = await db.query(`
                INSERT INTO users
                (username,
                 password,
                 name,
                 email,
                 dob,
                 photo,
                 zip,
                 latlng,
                 radius,
                 bio)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING
                    username,
                    name,
                    email,
                    dob,
                    photo,
                    zip,
                    latlng,
                    radius,
                    bio`, [
      username.toLowerCase(),
      hashedPassword,
      name.toLowerCase(),
      email.toLowerCase(),
      dob,
      photo,
      zip,
      latlng,
      radius,
      bio
    ],
    );

    const user = result.rows[0];

    return user;
  }

  static async authenticate({ username, password }) {
    const result = await db.query(`
        SELECT username,
               password,
               name,
               email,
               dob,
               photo,
               zip,
               latlng,
               radius,
               bio
        FROM users
        WHERE username = $1`, [username.toLowerCase()]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  static async getAll() {
    const result = await db.query(`
        SELECT username,
               name,
               email,
               dob,
               photo,
               zip,
               latlng,
               radius,
               bio
        FROM users
        ORDER BY RANDOM()`,
    );

    return result.rows;
  }

  /** Given a username, return data about user. */
  static async get(username) {
    const result = await db.query(`
        SELECT username,
               name,
               email,
               dob,
               photo,
               zip,
               latlng,
               radius,
               bio
        FROM users
        WHERE username = $1`, [username],
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Update user info */
  static async update(username, data) {
    const latlng = await convertZip(data.zip);

    data.latlng = latlng;

    const { setCols, values } = sqlForPartialUpdate(data);

    const usernameIdx = "$" + (values.length + 1);

    const q = `
        UPDATE users
        SET ${setCols}
        WHERE username = ${usernameIdx}
        RETURNING username,
                  name,
                  email,
                  dob,
                  photo,
                  zip,
                  latlng,
                  radius,
                  bio`;
    const result = await db.query(q, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    // delete user.password; TODO: need?
    return user;
  }

  /** Upload file to bucket. Return image URL. */

  static async handlePhoto(file) {
    const key = uuid.v4();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    try {
      await client.send(new PutObjectCommand(params));
      return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;
    } catch (err) {
      throw new BadRequestError('Failed to upload');
    }
  };
}



module.exports = User;