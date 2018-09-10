"use strict";
const express       = require("express");
const mongoose      = require("mongoose");

const CBase         = require("./Cotroller/CBase");
const CUser         = require("./Cotroller/CUser");
const Error         = require("./Define/Error");

const Schema        = mongoose.Schema;
const DBUsers       = mongoose.model("Users", new Schema(CUser.getModelDB(), { versionKey: false }));
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
        // Tạo mã id
        cUser.id = CBase.formatDate(new Date(), "yyyyMMddHHmmssSSS");

        // Nếu không có mã code thì tạo mã code bằng username
        if (cUser.code === null){
            cUser.code = cUser.id;
        }

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
        if (resultInsert !== null) {
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

    // Hàm kiểm tra dữ liệu đủ xử lý yêu cầu đăng nhập
    let retValid = cUser.isValidLogin();
    if (retValid.code !== Error.CODE_OK){
        res.send(retValid);
        return;
    }

    try {
        // Lấy thông tin user đăng nhập
        let data = await DBUsers.findOne()
            .where("username").equals(cUser.username)
            .where("password").equals(cUser.password);
        if (data !== null){
            // Lưu session user đăng nhập
            let cUser = CUser.parser(data._doc);
            CUser.saveSession(req, cUser);
            res.send(Error.OK(cUser));
        }
        else {
            res.send(Error.ERR_EXEC_DB_NOT_EXIST(cUser.username));
        }
    }
    catch (err) {
        res.send(Error.ERR_EXECUTE_DB(err + ""));
    }
});

router.get("/logout", CUser.Auth, async(req, res) => {
    CUser.deleteSession(req);
    res.send(Error.OK());
});

router.get("/changePassword", CUser.Auth, async (req, res) => {
    let dataReq = req.query;

    // Kiểm tra điều kiện đổi mật khẩu
    let retValid = CUser.isValidChangePassword(dataReq);
    if (retValid.code !== Error.CODE_OK){
        res.send(retValid);
        return;
    }

    // Lấy thông tin password cũ và mới
    let passwordOld = CBase.encodeSha512(dataReq.passwordOld);
    let passwordNew = CBase.encodeSha512(dataReq.passwordNew);

    // Lấy thông tin user session
    let cUser = CUser.getSession(req);

    // Cập nhật password
    if (passwordOld === cUser.password){
        let timeUpdate = CBase.formatDate(new Date(), "yyyyMMddHHmmssSSS");
        cUser.password = passwordNew;
        cUser.updateAt = timeUpdate;
        cUser.dateUpdatePassword = timeUpdate;

        try {
            let data = await DBUsers.findOneAndUpdate(
                {id: cUser.id},
                cUser,
                {new: true, upsert: true});
            let cUserUpd = CUser.parser(data._doc);

            // Lưu lại session của user update
            CUser.saveSession(req, cUserUpd);
            res.send(Error.OK(cUserUpd));
            return;
        }
        catch (err) {
            res.send(Error.ERR_EXECUTE_DB());
            return;
        }
    }
    else{
        res.send(Error.ERR_COF_PASSWORD());
    }
});

router.get("/changeUser", CUser.Auth, async (req, res) => {
    let dataReq = req.query;


});

router.get("/checkSession", CUser.Auth, async(req, res) => {
    res.send("Have session user : " + req.session.userSession.username);
});

module.exports = router;
