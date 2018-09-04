"use strict";
const express       = require("express");
const CBase         = require("./Cotroller/CBase");
const CUser         = require("./Cotroller/CUser");
const Error         = require("./Define/Error");
const mongoose      = require("mongoose");

const Schema        = mongoose.Schema;
const DBUsers       = mongoose.model("Users", new Schema(CUser.getModelDB()));
const router        = express.Router();

router.get("/register", async (req, res) => {
    // Lấy dữ liệu từ client request
    let dataReq = req.query;
    let cUser = CUser.parser(dataReq);

    // Hàm kiểm tra dữ liệu đủ xử lý yêu cầu đăng ký
    let retValid = cUser.isValidRegister();
    if (retValid.code !== Error.CODE_OK){
        res.send(retValid);
        return;
    }

    // Kiểm tra thông tin tên đăng nhập tồn tại
    try {
        let data = await DBUsers.findOne().where("username").equals(cUser.username).exec();
        if (data !== null){
            res.send(Error.ERR_EXEC_DB_EXIST(cUser.username));
            return;
        }
    }
    catch (err) {
        res.send(Error.ERR_EXECUTE_DB(err + ""));
        return;
    }

    try {
        // Tạo thời gian hiện tại
        let timeNow = CBase.formatDate(new Date(), "yyyyMMddHHmmssSSS");

        // Kiểm tra khời tạo ngày create
        if (cUser.createAt === null){
            cUser.createAt = timeNow;
        }

        // Kiểm tra khởi tạo ngày update
        if (cUser.updateAt === null){
            cUser.updateAt = timeNow;
        }

        // Kiểm tra khởi tạo ngày update password
        if (cUser.dateUpdatePassword === null){
            cUser.dateUpdatePassword = timeNow;
        }

        // Thêm dữ liệu vào db
        let resultInsert = await DBUsers.create(cUser);
        if (resultInsert !== null)
        {
            res.send(Error.OK(CUser.parser(resultInsert._doc)));
            return;
        }
    }
    catch (err) {
        res.send(Error.ERR_EXECUTE_DB(err + ""));
        return;
    }
});

router.get("/login", async(req, res) => {
    let dataReq = req.query;
    let cUser = CUser.parser(dataReq);
    try {
        let data = await DBUsers.findOne()
            .where("username").equals(cUser.username)
            .where("password").equals(cUser.password);
        if (data !== null){
            res.send(Error.OK(CUser.parser(data._doc)));
            return;
        }
        else {
            res.send(Error.ERR_EXEC_DB_NOT_EXIST(cUser.username));
        }
    }
    catch (err) {
        res.send(Error.ERR_EXECUTE_DB(err + ""));
    }
});

module.exports = router;
