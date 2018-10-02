"use strict";
const History       = require("../Model/History");
const CBase         = require("./CBase");

class CHistory extends History{
    constructor() {
        super();
    }

    setBefore(data) {
        this.clazz      = data.constructor.name;
        this.beforeData = JSON.stringify(data);
    }

    setAfter(data) {
        this.afterData  = JSON.stringify(data);
        this.createAt   = CBase.timeNow();
    }

    // /**
    //  * Hàm lấy tạo thông tin lưu trữ dữ liệu
    //  * @param beforeData
    //  * @param afterData
    //  * @param methodType
    //  */
    // static parser(clazz, beforeData, afterData, methodType){
    //     let cHistory            = new CHistory();
    //     cHistory.clazz          = clazz;
    //     cHistory.beforeData     = beforeData;
    //     cHistory.afterData      = afterData;
    //     cHistory.methodType     = methodType;
    //     cHistory.timeAt         = CBase.timeNow();
    //     return cHistory;
    // };

    /**
     * Thông tin db
     * @returns {{beforeData: StringConstructor, afterData: StringConstructor, methodType: NumberConstructor, timeAt: StringConstructor}}
     */
    static getModelDB() {
        return {
            id          : String,
            clazz       : String,
            beforeData  : String,
            afterData   : String,
            methodType  : Number,
            createAt    : String
        }
    };
}

module.exports = CHistory;