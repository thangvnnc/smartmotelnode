"use strict";
const ip            = require("ip");
const express       = require("express");
const bodyParser    = require("body-parser");
const apiv1         = require("./apiv1");
const app           = express();
const PORT          = 1234;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

var auth = (req, res, next) => {
    next();
};

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

