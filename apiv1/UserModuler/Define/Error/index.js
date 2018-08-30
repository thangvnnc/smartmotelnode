"use strict";
const BaseError = require("./BaseError");
class Error extends BaseError{}
Error.OK                = 0x00000000;
Error.OK 	            = (res)     => BaseError.from(Error.OK, res, "Thành công");
Error.ERR_FIELD_NULL    = 0x00000001;
Error.ERR_FIELD_NULL    = (msg)     => { return BaseError.from(Error.ERR_FIELD_NULL, null, "Lỗi field [{0}] không có dữ liệu", msg)};
Error.ERR_EXECUTE_DB    = 0x00000002;
Error.ERR_EXECUTE_DB    = (msg)     => { return BaseError.from(Error.ERR_EXECUTE_DB, null, "Lỗi field [{0}] không thêm dữ liêu", msg)};

module.exports = Error;
