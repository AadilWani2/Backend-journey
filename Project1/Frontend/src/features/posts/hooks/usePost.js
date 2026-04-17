import {getFeed,createPost} from "../services/post.api"
import {useContext, useEffect} from "react"
import {PostContext} from "../post.context"

export const usePost = () => {
    
    const context = useContext(PostContext)
    const {loading,setLoading,post,setPost,feed,setFeed} = context

    const handleGetFeed = async () => {
        setLoading(true)
        try{
            const data = await getFeed()
            setFeed(data)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleCreatePost = async (imageFile,caption) => {
        setLoading(true)
        try{
            const data = await createPost(imageFile,caption)
            setFeed(prevFeed => {
                if (!prevFeed) return prevFeed;
                return {
                    ...prevFeed,
                    posts: [data.post, ...prevFeed.posts]
                };
            })
            return true;
        }catch(error){
            console.log("Create Post Error:", error)
            alert("Upload failed: " + (error?.response?.data?.message || "Missing ImageKit Keys or Server down."))
            return false;
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetFeed()
    },[])           

    return {
        loading,
        post,
        feed,
        handleGetFeed,
        handleCreatePost
    }
}


