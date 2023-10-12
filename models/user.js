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

class User {

  static async register(
    { username, password, firstName, lastName, email, zipcode, friendRadius,
      hobbies, interests }) {

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
                 first_name,
                 last_name,
                 email,
                 zip_code,
                 friend_radius,
                 hobbies,
                 interests)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING
                    username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    zip_code AS "zipcode",
                    friend_radius AS "friendRadius",
                    hobbies,
                    interests`, [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
          zipcode,
          friendRadius,
          hobbies,
          interests
        ],
    );

    const user = result.rows[0];

    return user;
  }

  static setProfile(file) {
    const url = this.handlePhotoData(file);

    // TODO: DB QUERY
  }

  /** Upload file to bucket. Returns image URL. */

  static async handlePhotoData(file) {
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
      console.log(response);
      return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;
    } catch (err) {
      console.error(err);
    }
  };
}



module.exports = User;