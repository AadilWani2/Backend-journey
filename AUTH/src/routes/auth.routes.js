const jwt = require("jsonwebtoken");
const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/user.model");
const crypto = require("crypto");

authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
        return res.status(401).json({ message: "User already exists" });
    }
    const user = new userModel({
        name,
        email,
        password:crypto.createHash("sha256").update(password).digest("hex")
    });
    
    await user.save();
    
    const token = jwt.sign({
        id: user._id 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" });

    res.cookie("token",token)

res.status(200).json({
    message: "User registered successfully",
    user:{
        name:user.name,
        email:user.email
    },
    token
});
});

authRouter.get("/get-me",async (req,res)=>{
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id)

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({
            user:{
                name:user.name,
                email:user.email
            }
        }); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
})

authRouter.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = user.password === crypto.createHash("sha256").update(password).digest("hex");
    if(!isPasswordValid){
        return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({
        id: user._id 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" });
    res.cookie("token",token)
    res.status(200).json({
        message: "User logged in successfully",
        user:{
            name:user.name,
            email:user.email
        },
        token
    });
})


module.exports = authRouter;

