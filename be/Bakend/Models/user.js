var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new Schema({
    name: String,
    phone: Number,
    email: String,
    password: String,

    // 🔐 Forgot Password Fields
    resetToken: String,
    resetTokenExpiry: Date,
});

module.exports = mongoose.model("user_tbl", user);
