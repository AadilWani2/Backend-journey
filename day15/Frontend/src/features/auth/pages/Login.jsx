import { Link, useNavigate } from "react-router";
import "../style/login.scss"
import FormGroup from "../components/FormGroup";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";


const Login = () => {

    const {loading,handleLogin} = useAuth();
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    
    async function handleSubmit(e){
        e.preventDefault();
        try{
            await handleLogin({email,password});
            navigate("/");
        }catch(error){
            console.log(error);
        }
    }

  return (
    
    <main className='login-page'>
        <div className="form-container">
            <div className="auth-header">
                <h1>Welcome to <span>MoodSync</span></h1>
                <p>Log in to your account to continue.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <FormGroup
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email" placeholder="Enter your Email" />

                <FormGroup
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password" placeholder="Enter your Password" />

                <button type='submit' className="button">Login</button>
            </form>
            <div className='alt-actions'>
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    </main>
  )
}

export default Login