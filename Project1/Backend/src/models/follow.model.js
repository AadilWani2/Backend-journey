const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower :{
        type : String,
    },
    following :{
        type : String,
    },
    status : {
        type : String,
        enum : {
            values : ["pending","accepted","rejected"],
            message : "Invalid status"
        },
        default : "pending"
    }
},{timestamps:true})

followSchema.index({follower:1,following:1},{unique:true})

const followModel = mongoose.model("follows",followSchema)

module.exports = followModel
