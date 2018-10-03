"use strict";
const ip            = require("ip");
const express       = require("express");
const session       = require('express-session');
const bodyParser    = require("body-parser");
const mongoose      = require("mongoose");
const apiv1         = require("./apiv1");

const app           = express();
const PORT          = 1234;

// const URL           = "mongodb://192.168.1.110:27017/smartmotel";
const URL           = "mongodb://thang:thang01652608118@ds237192.mlab.com:37192/smartmotel";
mongoose.connect(URL, { useNewUrlParser: true });

app.use(session({
        secret: "6E0C130CA8CF53A2473BD88044B83DA9",
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.all("*", (req, res, next) => {
    next();
});

app.use("/apiv1", apiv1);
app.use("/admin", express.static(__dirname + "/admin"));

app.listen(PORT, (err) =>{
    if (err !== undefined) {
        console.log(err);
    }
    else {
        console.log("Server listen " + ip.address() + ": " + PORT);
    }
});