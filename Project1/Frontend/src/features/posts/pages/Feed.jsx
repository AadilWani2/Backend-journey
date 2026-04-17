import React from 'react'
import "../styles/feed.scss"
import Post from '../components/Post'
import { usePost } from '../hooks/usePost'
import { useEffect } from 'react'
import Nav from '../../shared/components/Nav'

const Feed = () => {

    const {feed,handleGetFeed,loading} = usePost()

    useEffect(() => {
        handleGetFeed()
    },[])

    if(loading || !feed){
        return <main><h1>Feed is loading..</h1></main>
    }

    console.log(feed)
  return (
    <main className='feed-page'>
        <Nav/>
        <div className="feed">
            <div className="posts">
                {feed.posts.map(post=>{
                    return <Post user={post.user} post={post}/>
                })}
            </div>
        </div>
    </main>
  )
}

export default Feed