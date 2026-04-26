import React, { useState, useRef } from 'react'
import "../styles/createPost.scss"
import { usePost } from "../hooks/usePost"
import { useNavigate } from "react-router"

const CreatePost = () => {

    const [previewUrl, setPreviewUrl] = useState(null)
    const [caption, setCaption] = useState("")
    const fileInputRef = useRef(null)

    const navigate = useNavigate()
    const { loading, handleCreatePost } = usePost()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
       
        const file = fileInputRef.current?.files[0]
        if (!file) {
            alert("Warning: Please select an image first!")
            return
        }
        
        const success = await handleCreatePost(file, caption)
        if (success) {
            navigate("/")
        }
    }

    if(loading){
        return <main className='create-post-page'><div className="form-container"><div className="header"><h1>Creating post...</h1></div></div></main>
    }

  return (
    <main className='create-post-page'>
        <div className="form-container">
            <div className="header">
                <button className="cancel-button" onClick={() => navigate("/")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h1>New Post</h1>
                <div style={{ width: '24px' }}></div> {/* Spacer for balance */}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="image-upload-area">
                    <input 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        type="file" 
                        name="postImage" 
                        id="postImage" 
                        accept="image/*" 
                    />
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="preview" />
                    ) : (
                        <div className="placeholder">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </div>
                            <span>Choose a photo to share the vibe</span>
                        </div>
                    )}
                </div>
                
                <div className="caption-area">
                    <textarea
                        value={caption}
                        onChange={(e)=>setCaption(e.target.value)}
                        placeholder="What's on your mind?..." 
                        name="caption" 
                        id="caption" 
                    />
                </div>

                <div className="footer-action">
                    <button className="post-button" type="submit" disabled={!previewUrl || loading}>
                        {loading ? "Posting..." : "Post to Aura"}
                    </button>
                </div>
            </form>
        </div>
    </main>
  )
}

export default CreatePost
