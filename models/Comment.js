const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    page: {
        type: String
    },

    post: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;
