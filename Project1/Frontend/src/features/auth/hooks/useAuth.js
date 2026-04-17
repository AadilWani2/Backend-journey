import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getMe } from "../services/auth.api";

export function useAuth(){
    const context = useContext(AuthContext)
    
    const {user,setUser,loading,setLoading} = context

    const handleLogin = async (username,password) => {
        try{
            setLoading(true)
            const data = await login(username,password)
            setUser(data.user)
        }
        catch(err){
            throw err
        }
        finally{
            setLoading(false)
        }
    }
const handleRegister = async (username,email,password) => {
    try{
        setLoading(true)
        const data = await register(username,email,password)
        setUser(data.user)
    }
    catch(err){
        throw err
    }
    finally{
        setLoading(false)
    }
}

return {
    user,
    loading,
    handleLogin,
    handleRegister
}
    



    
}