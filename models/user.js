"use strict";
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = require("../s3");
const uuid = require("uuid");
const client = new S3Client({region:'us-west-2'});

class User {

  static setProfile(buffer) {
    const url = this.handlePhotoData(buffer);

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

    // s3.upload(params, (err, data) => {
    //   if (err) {
    //     console.error(err); // TODO: throw error?
    //   }
    // });

      const command = new PutObjectCommand(params);

      try {
        const response = await client.send(command);
        console.log(response);
      } catch (err) {
        console.error(err);
      }
      return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;
    };
  }



module.exports = User;