"use strict";
const BaseError = require("./BaseError");
class Error extends BaseError{}
Error.OK                = 0x00000000;
Error.OK 	        = (response) => BaseError.from(Error.OK, response, "Thành công");
Error.ERR_FIELD_NULL    = 0x00000001;
Error.ERR_FIELD_NULL    = (msg)      => { return BaseError.from(Error.ERR_FIELD_NULL, null, "Lỗi field [{0}] không có dữ liệu", msg)};

module.exports = Error;
