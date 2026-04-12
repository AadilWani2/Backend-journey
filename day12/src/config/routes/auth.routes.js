const express = require("express")
const userModel = require("../../models/user.model")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const authRouter = express.Router()

authRouter.post("/register",async(req,res)=>{
    const {name,email,password} = req.body

    const isUserExist = await userModel.findOne({email})
    if(isUserExist){
        return res.status(400).json({
            message:"User already exists with same email"
        })
    }

    const user = await userModel.create({
        name,
        email,
        password
    })

    const token =jwt.sign({
        id:user._id
    },
    process.env.JWT_SECRET
    )

    res.cookie("jwt-token",token)

    res.status(201).json({
        message:"User registered successfully",
        user,
        token
    })

})



module.exports = authRouter