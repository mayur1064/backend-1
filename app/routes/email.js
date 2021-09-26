/*var express = require('express')
var router = express()
current_date=new Date().toJSON().slice(0,10)
const connection = require('../database/db')*/
const nodemailer = require('nodemailer');
       // const defaultMailingList = "example1@vultr.com,example2@vultr.com";
        const senderEmail = "chouguleani9@gmail.com";
        const senderPassword = "Aniket@99"; // gmail app password
module.exports = {
    sendMail: async (subject, text, to ) => {
        try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: senderEmail,
            pass: senderPassword,
            },
        });

        const message = {
            from: `report sender <${senderEmail}>`,
            to,
            subject,
            text: subject,
            html: text,
        };

        transporter.sendMail(message, () => {});
        } catch (e) {
        // handle errors here
        }
    },
};


/*module.exports = router*/