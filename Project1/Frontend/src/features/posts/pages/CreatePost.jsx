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
                <button className="cancel-button" onClick={() => navigate("/")}>×</button>
                <h1>New post</h1>
                <button className="post-button" onClick={handleSubmit} disabled={!previewUrl}>Share</button>
            </div>
            <form>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span>Tap to select photo</span>
                        </div>
                    )}
                </div>
                
                <div className="caption-area">
                    <input
                        value={caption}
                        onChange={(e)=>setCaption(e.target.value)}
                        type="text" 
                        placeholder="Write a caption..." 
                        name="caption" 
                        id="caption" 
                    />
                </div>

                <div className="secondary-settings">
                    <div className="setting-row">
                        <span>Tag people</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                    <div className="setting-row">
                        <span>Add location</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                    <div className="setting-row">
                        <span>Add music</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                </div>
            </form>
        </div>
    </main>
  )
}

export default CreatePost
