"use strict";
const express       = require("express");
const app           = express();
const user          = require("./UserModuler");

app.use("/users", user);

module.exports = app;