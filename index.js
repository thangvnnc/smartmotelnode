"use strict";
const ip = require("ip");
const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiv1 = require("./apiv1");
const CUser = require("./apiv1/Products/Cotroller/CUser");
const app = express();
const PORT = 1234;

// const URL           = "mongodb://192.168.1.110:27017/smartmotel";
const URL = "mongodb://thang:thang01652608118@ds237192.mlab.com:37192/smartmotel";
mongoose.connect(URL, {useNewUrlParser: true});
app.use(session({
        secret: "6E0C130CA8CF53A2473BD88044B83DA9",
        resave: true,
        saveUninitialized: true,
        // cookie: { maxAge: 600000 }
    })
);

// Cấu hình nhận dữ liệu post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Kiểm tra nếu người dùng vào home thì chuyển vào route app
app.get("/", (req, res) => {
    res.redirect("/app");
});

// Cấu hình api
app.use("/apiv1", apiv1);

// Cấu hình route
app.use("/app", express.static(__dirname + "/public/app"));
app.use("/common", express.static(__dirname + "/public/common"));
app.use("/login", CUser.AuthRedirectLogin, express.static(__dirname + "/public/login"));
app.use("/admin", CUser.AuthRoute, express.static(__dirname + "/public/admin"));

// Hàm lắng nghe web html theo port
app.listen(PORT, (err) => {
    if (err !== undefined) {
        console.log(err);
    }
    else {
        console.log("Server listen port  " + ip.address() + ": " + PORT);
    }
});