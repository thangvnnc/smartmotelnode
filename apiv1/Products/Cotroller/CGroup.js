"use strict";
const Group         = require("../Model/Group");
const CBase         = require("./CBase");

class CGroup extends Group {

    constructor() {
        super();
    }


    static getModelDB() {
        return {
            id          : String,
            name        : String,
            status      : Number,
            createAt    : String
        }
    };
}

module.exports = CHistory;