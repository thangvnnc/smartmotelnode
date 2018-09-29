"use strict";
const Group         = require("../Model/Group");
const CBase         = require("./CBase");

class CGroup extends Group {

    constructor() {
        super();
    }

    /**
     * Thông tin db
     * @returns {{beforeData: StringConstructor, afterData: StringConstructor, methodType: NumberConstructor, timeAt: StringConstructor}}
     */
    static getModelDB() {
        return {
            clazz       : String,
            beforeData  : String,
            afterData   : String,
            methodType  : Number,
            timeAt      : String
        }
    };
}

module.exports = CHistory;