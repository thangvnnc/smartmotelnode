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
        this.createAt           = null;
        this.updateAt           = null;
        this.dateUpdatePassword = null;
    }
}

module.exports = User;