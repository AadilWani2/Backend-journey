const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const identifyUser = require("../middleware/auth.middleware")
const likeModel = require("../models/like.model")

const upload = multer({storage:multer.memoryStorage()})


postRouter.post("/",identifyUser,upload.single("image"),postController.createPostController)


postRouter.get("/",identifyUser,postController.getPostControllers)

postRouter.get("/details/:postId",identifyUser,postController.getPostDetailsController)

postRouter.post("/like/:postId",identifyUser,postController.toggleLikePostController)

postRouter.post("/bookmark/:postId",identifyUser,postController.toggleBookmarkController)

postRouter.post("/comment/:postId",identifyUser,postController.addCommentController)

postRouter.get("/feed",identifyUser,postController.getFeedController)

postRouter.delete("/delete/:postId",identifyUser,postController.deletePostController)

module.exports = postRouter