import React, { useEffect, useState } from 'react'
import "../styles/users.scss"
import { searchUsers, toggleFollow } from '../services/user.api'
import Nav from '../../shared/components/Nav'

const SearchUsers = () => {
    // ... rest remains same until return ...
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const data = await searchUsers()
            setUsers(data)
        } catch (error) {
            console.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    const handleFollow = async (username, currentFollowingStatus) => {
        // Optimistic UI updates
        setUsers(users.map(u => {
            if(u.username === username) {
                return {...u, isFollowing: !currentFollowingStatus}
            }
            return u
        }))

        try {
            await toggleFollow(username, currentFollowingStatus)
        } catch (e) {
            // Revert on error
            setUsers(users.map(u => {
                if(u.username === username) {
                    return {...u, isFollowing: currentFollowingStatus}
                }
                return u
            }))
        }
    }

    if (loading) return <div className="users-page"><h1 style={{marginTop: '2rem', color: 'white'}}>Finding people...</h1></div>

    return (
        <main className="users-page">
            <Nav />
            <div className="content-wrapper">
                <h1>Discover</h1>
                
                <div className="user-list">
                    {users.map(u => (
                        <div key={u._id} className="user-card">
                            <div className="user-info">
                                <div className="img-wrapper">
                                    <img src={u.profileImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={u.username} />
                                </div>
                                <div className="details">
                                    <h2>{u.username}</h2>
                                    <p>{u.name || "New user"}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleFollow(u.username, u.isFollowing)}
                                className={`follow-btn ${u.isFollowing ? 'following' : ''}`}
                            >
                                {u.isFollowing ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    ))}
                    
                    {users.length === 0 && <p style={{color: 'white', textAlign: 'center'}}>No users found to follow.</p>}
                </div>
            </div>
        </main>
    )
}

export default SearchUsers
