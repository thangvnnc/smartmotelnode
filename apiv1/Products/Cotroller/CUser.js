"use strict";
const User = require("../Model/User");
const Error = require("../Define/Error");
const CBase = require("./CBase");

class CUser extends User {

    constructor() {
        super();
    }

    /**
     * Kiểm tra dữ liệu hợp lệ để đăng ký
     * @returns {Error}
     *      OK : Thành công
     *      !OK : Xem lỗi ở Error
     */
    isValidRegister() {
        // Kiểm tra field null
        let arrayField = ["username", "password", "name"];
        return CBase.isFieldsNotNull(this, arrayField)
    }

    /**
     * Kiểm tra dữ liệu hợp lệ để đăng nhập
     * @returns {Error}
     *      OK : Thành công
     *      !OK : Xem lỗi ở Error
     */
    isValidLogin() {
        // Kiểm tra field null
        let arrayField = ["username", "password"];
        return CBase.isFieldsNotNull(this, arrayField)
    }

    // /**
    //  * Lấy danh sách fields
    //  * @returns {Array} : Danh sách các field của model
    //  */
    // getFields() {
    //     let fields = [];
    //     for (let attr in this) {
    //         fields.push(attr);
    //     }
    //     return fields;
    // }

    /**
     *
     * @param cUserNew
     * @returns {CUser}
     */
    changeUser(cUserNew) {
        cUserNew.id = this.id;
        cUserNew.code = this.code;
        cUserNew.updateAt = CBase.timeNow();
        cUserNew.username = this.username;
        cUserNew.password = this.password;
        cUserNew.createAt = this.createAt;
        cUserNew.dateUpdatePassword = this.dateUpdatePassword;

        if (cUserNew.name === undefined || cUserNew.name === null) {
            cUserNew.name = this.name;
        }
        if (cUserNew.email === undefined || cUserNew.email === null) {
            cUserNew.email = this.email;
        }
        if (cUserNew.phone === undefined || cUserNew.phone === null) {
            cUserNew.phone = this.phone;
        }
        if (cUserNew.birthDay === undefined || cUserNew.birthDay === null) {
            cUserNew.birthDay = this.birthDay;
        }
        return cUserNew;
    }

    /**
     * Hàm chuyển dữ liệu request về dữ liệu controller user
     * @param data : Dữ liệu request cần chuyển thành controller
     * @returns {CUser} : controller user
     */
    static parser(data) {
        // Kiểm tra đầu vào parser là null thì trả về null
        if (data === null || data === undefined) {
            return null;
        }

        // Đọc dữ liệu user từ data object
        let cUser = new CUser();
        Object.assign(cUser, data);
        if (cUser.password !== null) {
            if (cUser.password.length !== 128) {
                cUser.password = CBase.encodeSha512(cUser.password);
            }
        }
        return cUser;
    };

    /**
     * Hàm tạo model db
     * @returns {{id: StringConstructor, code: StringConstructor, username: StringConstructor, password: StringConstructor, name: StringConstructor, email: StringConstructor, phone: StringConstructor, birthDay: StringConstructor, createAt: StringConstructor, updateAt: StringConstructor, dateUpdatePassword: StringConstructor}}
     */
    static getModelDB() {
        return {
            id: String,
            code: String,
            username: String,
            password: String,
            name: String,
            email: String,
            phone: String,
            birthDay: String,
            rights: Number,
            dateUpdatePassword: String,
            createAt: String
        }
    };

     /**
     * Hàm lưu session User
     * @param request : request data
     * @param cUser : user cần save
     */
    static saveSession(request, cUser) {
        /** @namespace request.session */
        request.session.userSession = cUser;
    };


    static deleteSession(request) {
        /** @namespace request.session */
        delete request.session.userSession;
    };

    /**
     * Hàm lấy thông tin user từ session
     * @param request : request data
     * @returns {CUser} : thông tin user lưu session
     */
    static getSession(request) {
        return CUser.parser(request.session.userSession);
    };

    /**
     * Auth api
     * @param request : Api request
     * @param response : Api response
     * @param next : next continue route
     * @constructor
     */
    static AuthApi(request, response, next) {
        /** @namespace request.session.userSession */
        if (request.session.userSession !== undefined) {
            next();
        }
        else {
            response.send(Error.ERR_API_AUTH_USER())
        }
    };

    /**
     * Auth api
     * @param request : request
     * @param response : response
     * @param next : next continue route
     * @constructor
     */
    static AuthRoute(request, response, next) {
        if (request.session.userSession === undefined) {
            response.redirect("/login");
        }
        else {
            next();
        }
    };

    /**
     * Auth api
     * @param request : request
     * @param response : response
     * @param next : next continue route
     * @constructor
     */
    static AuthRedirectLogin(request, response, next) {
        if (request.session.userSession !== undefined) {
            let cBase = CUser.getSession(request);
            if (cBase.rights === CUser.Rights().ADMIN) {
                response.redirect("/admin");
            }
            if (cBase.rights === CUser.Rights().USER) {
                console.log("login user")
            }
        }
        else {
            next();
        }
    };

    /**
     * Kiểm tra dữ liệu hợp lệ để đổi mật khẩu
     * @returns {Error}
     *      OK : Thành công
     *      !OK : Xem lỗi ở Error
     */
    static isValidChangePassword(dataReq) {
        // Kiểm tra field null
        let arrayField = ["passwordOld", "passwordNew"];
        return CBase.isFieldsNotNull(dataReq, arrayField)
    };

    /**
     * Kiểm tra dữ liệu hợp lệ để thực hiện thao tác quên mật khẩu
     * @returns {Error}
     *      OK : Thành công
     *      !OK : Xem lỗi ở Error
     */
    static isValidForgetPassword(dataReq) {
        // Kiểm tra field null
        let arrayField = ["email", "username"];
        return CBase.isFieldsNotNull(dataReq, arrayField)
    };
}

module.exports = CUser;
