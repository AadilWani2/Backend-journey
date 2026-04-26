const mongoose = require("mongoose");

const songsSchema = new mongoose.Schema({
    url :{
        type : String,
        required : [true, "URL is required"]
    },
    posterURL :{
        type : String,
        required : [true, "Poster URL is required"]
    },
    title :{
        type : String,
        required : [true, "Title is required"]
    },
    mood :{
        type : String,
        enum : ["happy","sad","surprised"],
        message : "Enum this is"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    
})

const songModel = mongoose.model("songs",songsSchema);

module.exports = songModel;