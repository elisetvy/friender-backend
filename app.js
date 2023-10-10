const express = require("express");
const app = express();
require("dotenv").config();
const {AWS_SECRET_KEY} = require("./config");

console.log(AWS_SECRET_KEY);

module.exports = app;