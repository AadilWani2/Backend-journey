const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const identifyUser = require("../middleware/auth.middleware")

const upload = multer({storage:multer.memoryStorage()})


postRouter.post("/",identifyUser,upload.single("image"),postController.createPostController)


postRouter.get("/",identifyUser,postController.getPostControllers)

postRouter.get("/details/:postId",identifyUser,postController.getPostDetailsController)



module.exports = postRouter