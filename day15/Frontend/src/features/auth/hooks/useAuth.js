import {loginUser,registerUser,getMe,logoutUser} from "../services/auth.api";
import { AuthContext } from "../auth.context";
import { useContext, useEffect } from "react";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context;

    async function handleRegister({username,email,password}){
        setLoading(true);
        try {
            const response = await registerUser({username,email,password});
            setUser(response.user);
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            setLoading(false);
        }
    }

    async function handleLogin({email,password}){
        setLoading(true);
        try {
            const response = await loginUser({email,password});
            setUser(response.user);
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            setLoading(false);
        }
    }

    async function handleGetMe(){
        setLoading(true);
        try {
            const response = await getMe();
            setUser(response.user);
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            setLoading(false);
        }
    }

    async function handleLogout(){
        setLoading(true);
        try {
            const response = await logoutUser();
            setUser(null);
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetMe();
    }, []);

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleGetMe,
        handleLogout
    }

}