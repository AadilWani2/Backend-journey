const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req,res){

    const followerUsername  = req.user.username;
    const followeeUsername = req.params.username;

    if(followerUsername === followeeUsername){
        return res.status(400).json({
            message : "You cannot follow yourself"
        })
    }

    const isFolloweeExist = await userModel.findOne({
        username : followeeUsername
    })

    if(!isFolloweeExist){
        return res.status(404).json({
            message : "User not found"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower : followerUsername,
        following : followeeUsername
    })

    if(isAlreadyFollowing){
        return res.status(200).json({
            message : "You are already following this user",
            follow : isAlreadyFollowing
        })
    }

    const followRecord = await followModel.create({
        follower : followerUsername,
        following : followeeUsername
    })

    return res.status(201).json({
        message : `You are now following ${followeeUsername}`,
        follow :followRecord
    })

}

async function unfollowUserController(req,res){
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    if(followerUsername === followeeUsername){
        return res.status(400).json({
            message : "You cannot unfollow yourself"
        })
    }

    const isFolloweeExist = await userModel.findOne({
        username : followeeUsername
    })

    if(!isFolloweeExist){
        return res.status(404).json({
            message : "User not found"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower : followerUsername,
        following : followeeUsername
    })

    if(!isAlreadyFollowing){
        return res.status(400).json({
            message : "You are not following this user"
        })
    }

    await followModel.findByIdAndDelete(isAlreadyFollowing._id)

    return res.status(201).json({
        message : `You are now unfollowing ${followeeUsername}`,
    })
}

async function getFollowRequestsController(req,res){
    const myUsername = req.user.username;

    const isUserExist = await userModel.findOne({
        username : myUsername
    })

    if(!isUserExist){
        return res.status(404).json({
            message : "User not found"
        })
    }

    const isFollowRequestExist = await followModel.findOne({
        following : myUsername,
        status : "pending"
    })

    if(!isFollowRequestExist){
        return res.status(404).json({
            message : "No follow requests found"
        })
    }

    const FollowRequests = await followModel.find({
        following : myUsername,
        status : "pending"
    })

    return res.status(200).json({
        message : "Follow requests fetched successfully",
        totalRequests : FollowRequests.length,
        FollowRequests
    })
}

async function acceptFollowRequestController(req,res){
    const myUsername = req.user.username;
    const followUsername = req.params.username;

    const request = await followModel.findOne({
        follower : followUsername,
        following : myUsername,
        status : "pending"
    })

    if(!request){
        return res.status(404).json({
            message : "Follow request not found"
        })
    }

    return res.status(200).json({
        message : `Follow request accepted successfully from ${followUsername}`,
        request
    })

}

async function rejectFollowRequestController(req,res){
    const myUsername = req.user.username;
    const followUsername = req.params.username;

    if(!followUsername){
        return res.status(400).json({
            message : "Username is required"
        })
    }
    if(myUsername === followUsername){
        return res.status(400).json({
            message : "You cannot follow yourself"
        })
    }

    const isFolloweeExist = await userModel.findOne({
        username : followUsername
    })

    if(!isFolloweeExist){
        return res.status(404).json({
            message : "User not found"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower : followUsername,
        following : myUsername
    })

    if(!isAlreadyFollowing){
        return res.status(400).json({
            message : "You are not following this user"
        })
    }

    const request = await followModel.findOneAndUpdate(
        {
            follower : followUsername,
            following : myUsername,
            status : "pending"
        },
        {
            status : "rejected"
        },
        {
            new : true
        }
    )

    if(!request){
        return res.status(404).json({
            message : "Follow request not found"
        })
    }

    return res.status(200).json({
        message : `Follow request rejected successfully from ${followUsername}`,
        request
    })
}

module.exports = {
    followUserController,
    unfollowUserController,
    getFollowRequestsController,
    acceptFollowRequestController,
    rejectFollowRequestController
}