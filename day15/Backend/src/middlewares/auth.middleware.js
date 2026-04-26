const userModel = require("../models/user.model");
const redis = require("../config/cache");
const jwt = require("jsonwebtoken");

async function authUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Token is not provided"});
    }
    try{
        const isBlacklisted = await redis.get(token);
        if(isBlacklisted){
            return res.status(401).json({message:"Token is blacklisted"});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }catch(error){
        return res.status(401).json({message:"Invalid token"});
    }
}

module.exports = {authUser}