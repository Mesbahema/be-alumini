const frontUrl = 'http://localhost:3000/reset-password'

const generateMessage = (email, otp) => {


    const message = {
        from: 'your_email@example.com',
        to: email,
        subject: 'Reset Password',
        html: `<h3>click the following link to reset password</h3><a href="${frontUrl}?email=${email}&code=${otp}">follow</a>`
    };
    return message
}

module.exports = generateMessage;