// TODO: MAKE SURE USERNAME + MORE ? GOES IN DB LOWERCASE

"use strict";

require("dotenv").config();
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client({ region: process.env.BUCKET_REGION });

const uuid = require("uuid");

const DEFAULT_PHOTO = 'https://i.pinimg.com/originals/33/70/29/33702949116bc77168dd93bdecc9f955.png';
const DEFAULT_RADIUS = 25

class User {

  static async register(
    { username, password, fname, lname, email, photo=DEFAULT_PHOTO, zip, radius=DEFAULT_RADIUS,
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

    const result = await db.query(`
                INSERT INTO users
                (username,
                 password,
                 fname,
                 lname,
                 email,
                 photo,
                 zip,
                 radius,
                 bio)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING
                    username,
                    fname,
                    lname,
                    email,
                    photo,
                    zip,
                    radius,
                    bio`, [
      username,
      hashedPassword,
      fname,
      lname,
      photo,
      email,
      zip,
      radius,
      bio
    ],
    );

    const user = result.rows[0];

    return user;
  }

  static async login({username, password}) {

    const result = await db.query(`
        SELECT username,
               password
        FROM users
        WHERE username = $1`,[username]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user.username;
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
  }

  static setProfile(file) {
    const url = this.handlePhotoData(file);

    // TODO: DB QUERY
  }

  /** Upload file to bucket. Return image URL. */

  static async handlePhoto(file) {
    const key = uuid.v4();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read"
    };

    const command = new PutObjectCommand(params);

    try {
      const response = await client.send(command);
      return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;
    } catch (err) {
      throw new BadRequestError('Failed to upload');
    }
  };
}



module.exports = User;