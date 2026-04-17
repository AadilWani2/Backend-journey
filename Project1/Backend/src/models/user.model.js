const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "Username Already Taken"],
        required: [true, "Username is required"]
    },
    email:{
        type: String,
        unique: [true, "Email Already Exists"],
        required: [true, "Email is required"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    bio:String,
    profileImage: {
        type:String,
        default: "https://ik.imagekit.io/hgrxt64fo/istockphoto-1495088043-612x612.jpg"
    }
});

const userModel = mongoose.model("newUsers", userSchema)

module.exports = userModel