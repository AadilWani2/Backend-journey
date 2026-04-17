const express = require("express")
const userController = require("../controllers/user.controller")
const identifyUser = require("../middleware/auth.middleware")

const userRouter = express.Router()

userRouter.post("/follow/:username",identifyUser,userController.followUserController)

userRouter.post("/unfollow/:username",identifyUser,userController.unfollowUserController)

userRouter.get("/requests",identifyUser,userController.getFollowRequestsController)

userRouter.post("/accept/:username",identifyUser,userController.acceptFollowRequestController)

userRouter.post("/reject/:username",identifyUser,userController.rejectFollowRequestController)

userRouter.get("/search", identifyUser, userController.searchUsersController)

userRouter.get("/profile", identifyUser, userController.getProfileController)

module.exports = userRouter