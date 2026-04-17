const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
    user: {
        type: String, // Storing username since likeModel uses username
        required: true
    },
    post: {
        ref: "newPosts",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });

const bookmarkModel = mongoose.model("newBookmarks", bookmarkSchema);
module.exports = bookmarkModel;
