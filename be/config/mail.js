const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "895e7497b71d68",
        pass: "a5a7a59e3d19f9"
    }
});

module.exports = transporter;
