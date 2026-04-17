const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        ref: "newUsers", // Population requires referencing the id
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    post: {
        ref: "newPosts",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const commentModel = mongoose.model("newComments", commentSchema);
module.exports = commentModel;
