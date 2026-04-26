import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials : true
});

export const registerUser = async ({username,email,password}) => {
    const response = await api.post("/api/auth/register",{username,email,password});
    return response.data;
};

export const loginUser = async ({email,password}) => {
    const response = await api.post("/api/auth/login",{email,password});
    return response.data;
};

export const getMe = async () => {
    const response = await api.get("/api/auth/get-me");
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.get("/api/auth/logout");
    return response.data;
};




