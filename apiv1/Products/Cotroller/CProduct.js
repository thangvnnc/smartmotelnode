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
            createAt    : String,
            price       : Number,
            percent     : Number,
            status      : Number
        }
    };
}

module.exports = CHistory;