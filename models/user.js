"use strict";

require("dotenv").config();

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const uuid = require("uuid");
const client = new S3Client({ region: process.env.BUCKET_REGION });

class User {

  static setProfile(file) {
    const url = this.handlePhotoData(file);

    // TODO: DB QUERY
  }

  static async handlePhotoData(file) {
    const key = uuid.v4();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL:"public-read"
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