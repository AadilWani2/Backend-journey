import React, {useState} from 'react'
import {toggleLike, toggleBookmark, addComment} from '../services/post.api'

const Post = ({user,post}) => {

  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)
  
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [commentCount, setCommentCount] = useState(post.commentCount || 0)

  const handleLike = async () => {
    const previousLiked = isLiked;
    setIsLiked(!previousLiked)
    setLikeCount(prev => previousLiked ? prev - 1 : prev + 1)
    try {
        await toggleLike(post._id)
    } catch(e) {
        setIsLiked(previousLiked)
        setLikeCount(prev => previousLiked ? prev + 1 : prev - 1)
    }
  }

  const handleBookmark = async () => {
    const previousAuth = isBookmarked;
    setIsBookmarked(!previousAuth)
    try {
        await toggleBookmark(post._id)
    } catch(e) {
        setIsBookmarked(previousAuth)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return;
    
    const submittedText = commentText;
    setCommentText("")
    setCommentCount(prev => prev + 1)
    setShowCommentBox(false)
    
    try {
        await addComment(post._id, submittedText)
    } catch(e) {
        setCommentCount(prev => prev - 1)
        alert("Failed to submit comment.")
    }
  }

  return (
    <div className="post">
        <div className="user">
            <div className="img-wrapper">
                <img src={user.profileImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" />
            </div>
            <p>{user.username}</p>
        </div>
        
        <img src={post.imgURL} alt="" />
        
        <div className="icons">
            <div className="left">
                {/* LIKE */}
                <button onClick={handleLike} className="icon-group">
                    <svg className={isLiked ? "liked" : ""} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z" />
                    </svg>
                    <span className="count-badge">{likeCount}</span>
                </button>
                
                {/* COMMENT */}
                <button onClick={() => setShowCommentBox(!showCommentBox)} className="icon-group">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.76282 17H20V5H4V18.3851L5.76282 17ZM6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455Z" />
                    </svg>
                    <span className="count-badge">{commentCount}</span>
                </button>
                
                {/* SEND (Placeholder) */}
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z" />
                    </svg>
                </button>
            </div>
            
            <div className="right">
                {/* BOOKMARK */}
                <button onClick={handleBookmark}>
                    <svg className={isBookmarked ? "liked" : ""} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z" />
                    </svg>
                </button>
            </div>
        </div>

        <div className="bottom">
            <p className="caption"><strong>{user.username}</strong> {post.caption}</p>
        </div>   

        {showCommentBox && (
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    value={commentText} 
                    onChange={e => setCommentText(e.target.value)} 
                    autoFocus
                />
                <button type="submit" disabled={!commentText.trim()}>Post</button>
            </form>
        )}
    </div>
  )
}

export default Post