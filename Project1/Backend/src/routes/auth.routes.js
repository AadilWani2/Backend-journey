const express = require("express")
const {registerController,loginController} = require("../controllers/auth.controller")
const identifyUser = require("../middleware/auth.middleware")
const authController = require("../controllers/auth.controller")

const authRouter = express.Router()

authRouter.post("/register",registerController)

authRouter.post("/login",loginController)

authRouter.get("/get-me",identifyUser, authController.getMeController)



module.exports = authRouter