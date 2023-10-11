"use strict";

require("dotenv").config();

const s3 = require("../s3");
const uuid = require("uuid");

class User {

  static setProfile(buffer) {
    const url = this.handlePhotoData(buffer);

    // TODO: DB QUERY
  }

  static handlePhotoData(buffer) {
    const key = uuid.v4();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err); // TODO: throw error?
      }
    });

    return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;
  }
}

module.exports = User;