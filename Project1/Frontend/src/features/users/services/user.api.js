import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials : true
})

export const searchUsers = async () => {
    const response = await api.get("/api/user/search")
    return response.data.users
}

export const toggleFollow = async (username, isFollowing) => {
    const endpoint = isFollowing ? `/api/user/unfollow/${username}` : `/api/user/follow/${username}`
    const response = await api.post(endpoint)
    return response.data
}

export const getProfile = async () => {
    const response = await api.get("/api/user/profile")
    return response.data
}
