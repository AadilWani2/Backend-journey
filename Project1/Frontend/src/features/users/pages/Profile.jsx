import React, { useEffect, useState } from 'react'
import "../styles/users.scss"
import { getProfile } from '../services/user.api'
import { useNavigate } from 'react-router'
import Nav from '../../shared/components/Nav'

const Profile = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deletingPostId, setDeletingPostId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const data = await getProfile()
            setProfile(data)
        } catch (error) {
            console.error("Failed to load profile")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="users-page"><Nav/><div className="content-wrapper"><h1 style={{marginTop: '2rem', color: 'white'}}>Loading...</h1></div></div>
    if (!profile) return <div className="users-page"><Nav/><div className="content-wrapper"><h1 style={{marginTop: '2rem', color: 'white'}}>Error loading profile.</h1></div></div>

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    const handleDeleteClick = (postId) => {
        setDeletingPostId(postId);
    }

    const confirmDelete = async () => {
        const postId = deletingPostId;
        setDeletingPostId(null);
        
        // Optimistic UI update
        const previousProfile = { ...profile };
        setProfile(prev => ({
            ...prev,
            stats: { ...prev.stats, posts: prev.stats.posts - 1 },
            posts: prev.posts.filter(p => p._id !== postId)
        }));

        try {
            const { deletePost } = await import('../../posts/services/post.api');
            await deletePost(postId);
        } catch (error) {
            console.error("Failed to delete post");
            setProfile(previousProfile);
            alert("Failed to delete post.");
        }
    }

    return (
        <main className="users-page">
            <Nav />
            <div className="content-wrapper">
                
                {/* Header Row */}
                <div className="page-header">
                    <h1>{profile.user.username}</h1>
                    <button 
                        onClick={handleLogout}
                        style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '100px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                        Sign Out
                    </button>
                </div>
                
                {/* Profile Stats Row */}
                <div className="profile-header">
                    <div className="img-wrapper">
                        <img 
                            src={profile.user.profileImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                            alt={profile.user.username} 
                        />
                    </div>

                    <div className="stats">
                        <div className="stat-box">
                            <h3>{profile.stats.posts}</h3>
                            <span>Posts</span>
                        </div>
                        <div className="stat-box">
                            <h3>{profile.stats.followers}</h3>
                            <span>Followers</span>
                        </div>
                        <div className="stat-box">
                            <h3>{profile.stats.following}</h3>
                            <span>Following</span>
                        </div>
                    </div>
                </div>

                {/* Bio Block */}
                <div className="profile-bio">
                    <h2>{profile.user.name || profile.user.username}</h2>
                    <p>Welcome to my Aura profile. Exploring new horizons. 🌌</p>
                </div>

                {/* Posts Section */}
                <div style={{marginTop: '1.5rem'}}>
                    <div style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}></div>

                    {profile.posts.length > 0 ? (
                        <div className="profile-posts-column">
                            {profile.posts.map(post => (
                                <div key={post._id} className="column-item" style={{position: 'relative'}}>
                                    <button 
                                        onClick={() => handleDeleteClick(post._id)}
                                        style={{
                                            position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                        title="Delete Post"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                    <img src={post.imgURL} alt="User Post" />
                                    {post.caption && (
                                        <div className="post-caption">{post.caption}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '2rem'}}>No posts yet.</p>   
                    )}
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {deletingPostId && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#191923',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '2rem',
                        maxWidth: '350px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            width: '60px', height: '60px',
                            background: 'rgba(255, 71, 87, 0.1)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </div>
                        <h2 style={{color: 'white', fontSize: '1.4rem', margin: '0 0 0.5rem 0', fontWeight: '800'}}>Delete Post?</h2>
                        <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.4'}}>This action cannot be undone. It will be permanently removed from your profile.</p>
                        
                        <div style={{display: 'flex', gap: '1rem', flexDirection: 'column'}}>
                            <button 
                                onClick={confirmDelete}
                                style={{
                                    background: '#ff4757', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                            <button 
                                onClick={() => setDeletingPostId(null)}
                                style={{
                                    background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Profile
