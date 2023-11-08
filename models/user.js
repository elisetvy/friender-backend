// TODO: MAKE SURE USERNAME + MORE ? GOES IN DB LOWERCASE
// TODO: LOWERCASE USERNAMES WHEN LOGGING IN ALSO
// TODO: NOT SURE WHY RADIUS IS DEFAULTING TO 0 IF LEFT EMPTY

"use strict";

require("dotenv").config();

const db = require("../db");

const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client({ region: process.env.BUCKET_REGION });
const uuid = require("uuid");

const { convertZip } = require("../utils");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const DEFAULT_PHOTO = 'https://i.pinimg.com/originals/33/70/29/33702949116bc77168dd93bdecc9f955.png';
const DEFAULT_RADIUS = 25;

class User {

  static async register(
    { username, password, fname, lname, email, dob, photo=DEFAULT_PHOTO, zip, radius,
      bio }) {

    const duplicateCheck = await db.query(`
      SELECT username
      FROM users
      WHERE username = $1`, [username],
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const latlng = await convertZip(zip);

    if (radius < 1) {
      radius = DEFAULT_RADIUS;
    }

    // TODO: CHECK AGE BEFORE INSERT INTO DB

    const result = await db.query(`
                INSERT INTO users
                (username,
                 password,
                 fname,
                 lname,
                 email,
                 dob,
                 photo,
                 zip,
                 latlng,
                 radius,
                 bio)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING
                    username,
                    fname,
                    lname,
                    email,
                    dob,
                    photo,
                    zip,
                    latlng,
                    radius,
                    bio`, [
      username,
      hashedPassword,
      fname,
      lname,
      email,
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
               fname,
               lname,
               email,
               dob,
               photo,
               zip,
               latlng,
               radius,
               bio
        FROM users
        WHERE username = $1`, [username]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid Username/Password");
  }

  static async getAll() {
    const result = await db.query(`
        SELECT username,
               fname,
               lname,
               email,
               photo,
               zip,
               radius,
               bio
        FROM users
        ORDER BY username`,
    );

    return result.rows;
  }xw

  /** Given a username, return data about user. */
  static async get(username) {
    const userRes = await db.query(`
        SELECT username,
               fname,
               lname,
               email,
               photo,
               zip,
               radius,
               bio
        FROM users
        WHERE username = $1`, [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

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