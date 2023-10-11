"use strict";

const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.BUCKET_REGION,
});

const s3 = new AWS.S3();

module.exports = s3;