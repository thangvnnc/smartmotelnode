"use strict";
const express       = require("express");
const router        = express.Router();
const CUser         = require("./Cotroller/CUser");
const Error         = require("./Define/Error");
const MongoDB       = require("mongodb");
const MongoClient   = MongoDB.MongoClient;

router.get("/register", (req, res) => {
    // Lấy dữ liệu từ client request
    let dataReq = req.query;
    let cUser = CUser.parser(dataReq);

    // Hàm kiểm tra dữ liệu đủ xử lý yêu cầu đăng ký
    let ret = cUser.isValidRegister();
    if (ret.code !== Error.OK().code){
        res.send(ret);
        return;
    }

    res.send(ret);
});

module.exports = router;
