const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function registerController(req,res){
    const {email,username,password,bio,profileImage} = req.body
    const isUserExist = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })
    if(isUserExist){
        return res.status(409).json({
            message : "User already exists"+(isUserExist.email === email ? "Email already Exist" : "Username Already Taken")
        })
    }
    const hash = await bcrypt.hash(password,10)
    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password : hash
    })
    const token = jwt.sign(
        {
        id : user._id,
        username : user.username
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)

    res.status(201).json({
        message : "User succesfully registered",
        user:{
            email : user.email,
            username : user.username,
            bio : user.bio,
            profileImage : user.profileImage
        }
    })
}


async function loginController(req,res){
    const {username,email,password} = req.body
    const user = await userModel.findOne({
    $or:[
        {
            username :username
        },
        {
            email : email
        }
    ]
    }).select("+password")

    if(!user){
        return res.status(404).json({
            message : "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message : "Password is invaid"
        })
    }

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)

    res.status(201).json({
        message : "User logged in successfully",
        user:{
            username : user.username,
            email : user.email,
            bio : user.bio,
            profileImage : user.profileImage
        }
    })
}

async function getMeController(req,res){
    const user = req.user
    const userDetails = await userModel.findById(user.id)
    
    res.status(200).json({
        user : {
            username : userDetails.username,
            email : userDetails.email,
            bio : userDetails.bio,
            profileImage : userDetails.profileImage
        }

    })
}

module.exports = {
    registerController,
    loginController,
    getMeController
}