"use strict";
class History{
    constructor() {
        this.id             = null;
        this.clazz          = null;
        this.methodType     = null;
        this.beforeData     = null;
        this.afterData      = null;
        this.createAt       = null;
    }

    static MethodType() {
        return Object.freeze({UPDATE: 0, DELETE: 1});
    }
}

module.exports = History;