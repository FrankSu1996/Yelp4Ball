var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    email:    {type: String, required: true},
    password: {type: String, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

module.exports = mongoose.model("User", UserSchema);