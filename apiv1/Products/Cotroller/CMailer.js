"use strict";
const nodemailer    = require("nodemailer");

const Error         = require("../Define/Error");
const CLog          = require("./CLog");

const MAIL_USER     = "thangdeveloper1509@gmail.com";
const MAIL_PASSWORD = "01667723137";
const MAIL_HOST     = "smtp.gmail.com";
const MAIL_PORT     = 465;
const MAIL_SECURE   = true;

class CMailer{
    static async sendEmailForgetPassword(email, conf){
        let smtpConfig = {
            host: MAIL_HOST,
            port: MAIL_PORT,
            secure: MAIL_SECURE, // use SSL,
                                 // you can try with TLS, but port is then 587
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        };

        let transporter = nodemailer.createTransport(smtpConfig);
        let mailOptions = {
            from: MAIL_USER,
            to: email, // list of receivers
            subject: "Quên mật khẩu", // Subject line
            // text: 'this is some text', //, // plaintext body
            html: "Mã xác nhận là: <b>" + conf + "</b>" // You can choose to send an HTML body instead
        };

        try {
            await transporter.sendMail(mailOptions);
            return Error.OK();
        }
        catch (err) {
            CLog.write(err + "");
            return Error.ERR_SEND_MAIL(email);
        }
    };
}

module.exports = CMailer;