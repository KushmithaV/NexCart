const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth:{

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    },

    tls: {

        rejectUnauthorized: false

    }

});

const sendMail = async (to, subject, html) => {

    try{

        await transporter.sendMail({

            from:`"NexCart" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html

        });

        console.log("Email Sent Successfully");

    }

    catch(err){

        console.log("Email Error:",err);

    }

};

module.exports = sendMail;