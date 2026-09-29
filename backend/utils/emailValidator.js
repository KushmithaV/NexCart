const axios = require("axios");

async function validateEmail(email) {

    try {

        const response = await axios.get(
            "https://apilayer.net/api/check",
            {
                params: {
                    access_key: process.env.EMAIL_API_KEY,
                    email: email,
                    smtp: 1,
                    format: 1
                }
            }
        );

        const data = response.data;

        return (
            data.format_valid &&
            data.mx_found &&
            data.smtp_check
        );

    } catch (err) {

        console.log("MailboxLayer Error:", err.response?.data || err.message);

        return false;

    }

}

module.exports = validateEmail;