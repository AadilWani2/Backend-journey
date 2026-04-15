const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imgURL:{
        type:String,
        required:[true,"imgURL required to upload an post"]
    },
    user:{
        ref : "newUsers",
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"user required to upload an post"]
    }
})

const postModel = mongoose.model("newPosts",postSchema)

module.exports = postModel