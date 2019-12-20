var mongoose = require("mongoose");

var CommentSchema = mongoose.Schema({
    text: String, 
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        userName: String
    },
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Comment", CommentSchema);