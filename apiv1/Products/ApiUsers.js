"use strict";
const express       = require("express");
const mongoose      = require("mongoose");

const CBase         = require("./Cotroller/CBase");
const CUser         = require("./Cotroller/CUser");
const CHistory      = require("./Cotroller/CHistory");
const CLog          = require("./Cotroller/CLog");
const CMailer       = require("./Cotroller/CMailer");
const Error         = require("./Define/Error");

const Schema        = mongoose.Schema;
const DBUsers       = mongoose.model("Users", new Schema(CUser.getModelDB(), { versionKey: false }));
const DBHistorys    = mongoose.model("Historys", new Schema(CHistory.getModelDB(), { versionKey: false }));
const router        = express.Router();

router.post("/register", async (req, res) => {
    // Lấy dữ liệu từ client request
    let dataReq = req.body;
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
        cUser.id = CBase.timeNow();

        // Nếu không có mã code thì tạo mã code bằng username
        if (cUser.code === null){
            cUser.code = cUser.id;
        }

        // Tạo thời gian hiện tại
        let timeNow = CBase.timeNow();

        // Kiểm tra khởi tạo quyền user
        if (cUser.rights === null){
            cUser.rights = CUser.Rights().USER;
        }

        // Kiểm tra khởi tạo ngày update password
        if (cUser.dateUpdatePassword === null){
            cUser.dateUpdatePassword = timeNow;
        }

        // Kiểm tra khời tạo ngày create
        if (cUser.createAt === null){
            cUser.createAt = timeNow;
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

router.post("/login", async(req, res) => {
    let dataReq = req.body;
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

router.post("/logout", CUser.AuthApi, async(req, res) => {
    CUser.deleteSession(req);
    res.send(Error.OK());
});

router.post("/forget", async (req, res) => {
    let dataReq = req.body;

    // Kiểm tra điều kiện quên mật khẩu
    let retValid = CUser.isValidForgetPassword(dataReq);
    if (retValid.code !== Error.CODE_OK){
        res.send(retValid);
        return;
    }
});

router.post("/changePassword", CUser.AuthApi, async (req, res) => {
    let dataReq = req.body;

    // Model chuẩn bị để lưu lịch sử thay đổi mật khẩu
    let cHistory        = new CHistory();
    cHistory.methodType = CHistory.MethodType().UPDATE;

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

    // Set giá trị trước khi thay đổi password vào lịch sử
    cHistory.setBefore(cUser);

    // Cập nhật password
    if (passwordOld === cUser.password){
        let timeUpdate = CBase.timeNow();
        cUser.password = passwordNew;
        cUser.updateAt = timeUpdate;
        cUser.dateUpdatePassword = timeUpdate;

        try {
            let resultUpd = await DBUsers.findOneAndUpdate(
                {id: cUser.id},
                cUser,
                {new: true, upsert: true});
            let cUserUpd = CUser.parser(resultUpd._doc);

            // Lưu lại session của user update
            CUser.saveSession(req, cUserUpd);
            res.send(Error.OK(cUserUpd));

            // Set giá trị sau khi thay đổi password vào lịch sử
            cHistory.setAfter(cUser);

            // Tiến hành lưu thông tin lịch sử
            try {
                cHistory.id = CBase.timeNow();
                await DBHistorys.create(cHistory);
            }catch (err) {
                CLog.write(err + "");
            }
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

router.post("/changeUser", CUser.AuthApi, async (req, res) => {
    let dataReq = req.body;

    // Model chuẩn bị để lưu lịch sử thay đổi mật khẩu
    let cHistory        = new CHistory();
    cHistory.methodType = CHistory.MethodType().UPDATE;

    // Lấy thông tin của user cũ trong session
    let cUserOld = CUser.getSession(req);
    cHistory.setBefore(cUserOld);

    // Lấy thông tin của user cần thay đổi
    let cUserNew = CUser.parser(dataReq);

    // Đổi thông tin các thuộc tính của user
    let cUserUpdate = cUserOld.changeUser(cUserNew);
    cHistory.setAfter(cUserUpdate);

    try {
        let data = await DBUsers.findOneAndUpdate(
            {id: cUserUpdate.id},
            cUserUpdate,
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
});

router.post("/checkSession", CUser.AuthApi, async(req, res) => {
    res.send("Have session user : " + req.session.userSession.username);
});

module.exports = router;
