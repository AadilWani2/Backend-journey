import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export async function getSong({mood}){
    try{
        const response = await api.get("/api/song?mood=" + mood);
        return response.data;
    }catch(error){
        return error;
    }
}

export async function uploadSong({ file, mood }) {
    try {
        const formData = new FormData();
        formData.append("song", file);
        formData.append("mood", mood);
        const response = await api.post("/api/song", formData);
        return response.data;
    } catch (error) {
        return error?.response?.data || { message: "Upload failed" };
    }
}