"use strict";
class User{
    constructor()
    {
        this.id                 = null;
        this.code               = null;
        this.username           = null;
        this.password           = null;
        this.name               = null;
        this.email              = null;
        this.phone              = null;
        this.birthDay           = null;
        this.rights             = null;
        this.dateUpdatePassword = null;
        this.createAt           = null;
    }

    static Rights() {
        return Object.freeze({USER: 0, ADMIN: 1});
    }
}

module.exports = User;