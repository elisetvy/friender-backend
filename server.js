"use strict";

const app = require("./app");
const { PORT } = require("./config");

/** Start server. */
app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});