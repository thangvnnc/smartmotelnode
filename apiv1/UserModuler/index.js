"use strict";
const express       = require("express");
const CUser         = require("./Cotroller/CUser");
const Error         = require("./Define/Error");
const mongoose      = require("mongoose");

const Schema        = mongoose.Schema;
const DBUsers       = mongoose.model("Users", new Schema(CUser.getModelDB()));
const router        = express.Router();

router.get("/register", (req, res) => {
    // Lấy dữ liệu từ client request
    let dataReq = req.query;
    let cUser = CUser.parser(dataReq);

    // Hàm kiểm tra dữ liệu đủ xử lý yêu cầu đăng ký
    let retValid = cUser.isValidRegister();
    if (retValid.code !== Error.OK){
        res.send(retValid);
        return;
    }

    // Tạo DBUser
    let dbUser = new DBUsers(cUser);
    dbUser.save().then((responseUser) => {

        // Thông báo thêm thành công
        res.send(Error.OK(responseUser));
    }).catch((err) => {

        // Thông báo thêm thất bại
        res.send(Error.ERR_EXECUTE_DB(err + ""));
    });
});

module.exports = router;
