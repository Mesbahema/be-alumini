// Define a Post schema
const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    // Reference the User model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;