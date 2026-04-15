const postModel = require("../models/post.model")
const Imagekit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")



const imagekit = new Imagekit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
})

async function createPostController(req,res){

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer),'file'),
        fileName:"Test"
    })

    const post = await postModel.create({
        imgURL : file.url,
        user : req.user.id,
        caption : req.body.caption
    })

    res.send(file)
}

async function getPostControllers(req,res){
    
    const UserID = req.user.id

    const posts = await postModel.find({
        user : UserID
    })

    res.status(200).json({
        message : "Posts fetched successfully",
        posts
    })
}

async function getPostDetailsController(req,res){
    
    const UserID = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    if(!post){
        return res.status(404).json({
            message : "Post not found"
        })
    }

    const isValidUser = post.user.toString() === UserID
    if(!isValidUser){
        return res.status(403).json({
            message : "Forbidden Content"
        })
    }

    res.status(200).json({
        message : "Post details fetched successfully",
        post
    })

}

module.exports = {
    createPostController,
    getPostControllers,
    getPostDetailsController
}