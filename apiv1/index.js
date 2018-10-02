"use strict";
const express       = require("express");
const app           = express();
const user          = require("./Products");

app.use("/users", user);

module.exports = app;
