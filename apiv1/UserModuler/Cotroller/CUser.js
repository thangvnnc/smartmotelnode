"use strict";
const User          = require("../Model/User");
const Error         = require("../Define/Error");
class CUser extends User{
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
        return this.isFieldsNotNull(arrayField)
    }

    /**
     * Kiểm tra các trường không phải là null và undefined
     * @param fields : string[] sách các field cần kiểm tra
     * @returns {Error}
     *      OK : Thành công
     *      !OK : Thất bại vui lòng xem định nghĩa ở fileError
     */
    isFieldsNotNull(fields) {
        for(let fieldId in fields){
            let field = fields[fieldId];
            if (this[field] === null || this[field] === undefined) {
                return Error.ERR_FIELD_NULL(field);
            }
        }
        return Error.OK(this);
    }

    /**
     * Lấy danh sách fields
     * @returns {Array} : Danh sách các field của model
     */
    getFields(){
        let fields = [];
        for(let attr in this){
            fields.push(attr);
        }
        return fields;
    }
}

/**
 * Hàm chuyển dữ liệu request về dữ liệu controller user
 * @param data : Dữ liệu request cần chuyển thành controller
 * @returns {CUser} : controller user
 */
CUser.parser = (data) => {

    // Kiểm tra đầu vào parser là null thì trả về null
    if (data === null || data === undefined)
    {
        return null;
    }

    // Đọc dữ liệu user từ data object
    var cUser = new CUser();
    Object.assign(cUser, data);
    return cUser;
};

/**
 * Hàm tạo model db
 * @returns {{id: NumberConstructor, code: NumberConstructor, username: StringConstructor, password: StringConstructor, name: StringConstructor, email: StringConstructor, phone: StringConstructor, birthDay: StringConstructor, createAt: NumberConstructor, updateAt: NumberConstructor, dateUpdatePassword: NumberConstructor}}
 */
CUser.getModelDB = () => {
    return {
        id : Number,
        code : Number,
        username : String,
        password : String,
        name : String,
        email : String,
        phone : String,
        birthDay : String,
        createAt : String,
        updateAt : String,
        dateUpdatePassword : String
    }
};

/////////////////////////////////////////////////////////////////////////////////////
/**
 * Hàm lưu session User
 * @param request : request data
 * @param cUser : user cần save
 */
CUser.saveSession = (request, cUser) => {
    /** @namespace request.session */
    request.session.userSession = cUser;
};


CUser.deleteSession = (request) => {
    /** @namespace request.session */
    delete request.session.userSession;
};

/**
 * Hàm lấy thông tin user từ session
 * @param request : request data
 * @returns {CUser} : thông tin user lưu session
 */
CUser.getSession = (request) => {
    /** @namespace request.userSession */
    return request.session.userSession;
};

CUser.Auth = (request, response, next) => {
    /** @namespace request.session.userSession */
    if (request.session.userSession !== undefined){
        next();
    }
    else{
        response.send(Error.ERR_AUTH_USER())
    }
};
module.exports = CUser;
