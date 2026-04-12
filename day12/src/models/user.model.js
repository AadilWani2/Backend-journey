const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"name is required"]
    },
    email: {
        type:String,
        unique:[true,"email already exists"],
        required:[true,"email is required"]
    },
    password: {
        type:String,
        required:true
    }
})

const userModel = mongoose.model("Users",userSchema)

module.exports = userModel