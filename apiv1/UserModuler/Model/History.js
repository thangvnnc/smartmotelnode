"use strict";

class History{
    constructor() {
        this.clazz          = null;
        this.methodType     = null;
        this.beforeData     = null;
        this.afterData      = null;
        this.timeAt         = null;
    }
    static MethodType() {
        return Object.freeze({UPDATE: 0, DELETE: 1});
    }
}

module.exports = History;