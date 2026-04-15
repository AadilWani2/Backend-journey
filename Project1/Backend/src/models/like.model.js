const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts",
        required : [true,"Post is required"]
    },
    user : {
        type : String,
        required : [true,"User is required"]
    },
    status : {
        type : String,
        enum : {
            values : ["pending","liked","unliked"],
            message : "Invalid status"
        },
        default : "pending"
    }
},{timestamps:true})

likeSchema.index({post:1,user:1},{unique:true})

const likeModel = mongoose.model("likes",likeSchema)

module.exports = likeModel