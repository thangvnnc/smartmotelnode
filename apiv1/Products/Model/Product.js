"use strict";
class Product{
    constructor() {
        this.id             = null;
        this.name           = null;
        this.price          = null;
        this.percent        = null;
        this.status         = null;
        this.createAt       = null;
    }
    // static MethodType() {
    //     return Object.freeze({UPDATE: 0, DELETE: 1});
    // }
}

module.exports = Product;