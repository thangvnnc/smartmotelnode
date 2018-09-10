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

app.listen(PORT, (err) =>{
    if (err !== undefined)
    {
        console.log(err);
    }
    else
    {
        console.log("Server listen " + ip.address() + ": " + PORT);
    }
});

const nodemailer = require("nodemailer");
let sendEmail = function(){
    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL,
                      // you can try with TLS, but port is then 587
        auth: {
            user: 'thangdeveloper1509@gmail.com', // Your email id
            pass: '01667723137' // Your password
        }
    };

    let transporter = nodemailer.createTransport(smtpConfig);
    // replace hardcoded options with data passed (somedata)
    let mailOptions = {
        from: 'thangdeveloper1509@gmail.com', // sender address
        to: 'thangvnnc@gmail.com', // list of receivers
        subject: 'Test email', // Subject line
        text: 'this is some text', //, // plaintext body
        html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return false;
        }else{
            console.log('Message sent: ' + info.response);
            return true;
        }
    });
};