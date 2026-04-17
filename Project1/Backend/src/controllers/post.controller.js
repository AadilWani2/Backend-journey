const postModel = require("../models/post.model")
const Imagekit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const likeModel = require("../models/like.model")
const bookmarkModel = require("../models/bookmark.model")
const commentModel = require("../models/comment.model")


const imagekit = new Imagekit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
})

async function createPostController(req,res){
    try {
        const file = await imagekit.files.upload({
            file: req.file.buffer.toString("base64"),
            fileName: "Test"
        })

        const post = await postModel.create({
            imgURL : file.url,
            user : req.user.id,
            caption : req.body.caption
        })

        await post.populate("user")

        res.status(201).json({
            message: "Post created successfully",
            post: post
        })
    } catch (error) {
        console.log("CRITICAL ERROR IN CREATE POST:", error)
        res.status(500).json({ message: "Server error during post creation" })
    }
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

async function toggleLikePostController(req,res){
    try {
        const username = req.user.username
        const postId = req.params.postId

        const post = await postModel.findById(postId)
        if(!post){
            return res.status(404).json({ message : "Post not found" })
        }

        const isLiked = await likeModel.findOne({ post : postId, user : username })

        if(isLiked){
            await likeModel.findByIdAndDelete(isLiked._id)
            return res.status(200).json({ message : "Post unliked successfully", liked: false })
        } else {
            await likeModel.create({ post : postId, user : username })
            return res.status(201).json({ message : "Post liked successfully", liked: true })
        }
    } catch (err) {
        res.status(500).json({ message: "Server error during like toggle" })
    }
}

async function toggleBookmarkController(req,res){
    try {
        const username = req.user.username
        const postId = req.params.postId

        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const isBookmarked = await bookmarkModel.findOne({ post: postId, user: username })

        if (isBookmarked) {
            await bookmarkModel.findByIdAndDelete(isBookmarked._id)
            return res.status(200).json({ message: "Bookmark removed", bookmarked: false })
        } else {
            await bookmarkModel.create({ post: postId, user: username })
            return res.status(201).json({ message: "Post bookmarked", bookmarked: true })
        }
    } catch (err) {
        res.status(500).json({ message: "Server error during bookmark toggle" })
    }
}

async function addCommentController(req,res){
    try {
        const userId = req.user.id
        const postId = req.params.postId
        const { text } = req.body

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" })
        }

        const comment = await commentModel.create({
            user: userId,
            post: postId,
            text: text
        })
        
        await comment.populate("user")

        res.status(201).json({ message: "Comment added successfully", comment })
    } catch (err) {
        res.status(500).json({ message: "Server error during comment creation" })
    }
}

async function getFeedController(req,res){
    try {
        const user = req.user;
        const followModel = require("../models/follow.model");
        const userModel = require("../models/user.model");

        // 1. Get all usernames this user follows
        const followRecords = await followModel.find({ follower: user.username }).lean();
        const followingUsernames = followRecords.map(f => f.following);
        
        // 2. Always include themselves
        followingUsernames.push(user.username);

        // 3. Find ObjectIds of these users to query the posts collection
        const validUsers = await userModel.find({ username: { $in: followingUsernames } }).select('_id').lean();
        const validUserIds = validUsers.map(u => u._id);

        // 4. Fetch posts only from valid users
        const rawPosts = await postModel.find({ user: { $in: validUserIds } })
            .sort({ _id: -1 })
            .populate("user")
            .lean();
        
        const posts = await Promise.all(rawPosts.map(async (post) => {
            // Find if user liked it
            const isLiked = await likeModel.exists({
                user : user.username,
                post : post._id
            })

            const isBookmarked = await bookmarkModel.exists({
                user: user.username,
                post: post._id
            })

            // Give the total counts
            const likeCount = await likeModel.countDocuments({
                post : post._id
            })

            const commentCount = await commentModel.countDocuments({
                post : post._id
            })

            post.isLiked = Boolean(isLiked)
            post.isBookmarked = Boolean(isBookmarked)
            post.likeCount = likeCount
            post.commentCount = commentCount
            return post
        }))

        res.status(200).json({
            message : "Posts fetched successfully",
            posts
        })
    } catch (error) {
        console.log("CRITICAL ERROR IN GET FEED:", error)
        res.status(500).json({ message: "Server error fetching feed" })
    }
}

    

async function deletePostController(req,res){
    try {
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
                message : "Forbidden: You do not own this post"
            })
        }

        // Delete post
        await postModel.findByIdAndDelete(postId)

        // Optionally cascade delete comments/likes/bookmarks:
        await likeModel.deleteMany({ post: postId })
        await bookmarkModel.deleteMany({ post: postId })
        await commentModel.deleteMany({ post: postId })

        res.status(200).json({
            message : "Post deleted successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server error deleting post" })
    }
}

module.exports = {
    createPostController,
    getPostControllers,
    getPostDetailsController,
    toggleLikePostController,
    toggleBookmarkController,
    addCommentController,
    getFeedController,
    deletePostController
}