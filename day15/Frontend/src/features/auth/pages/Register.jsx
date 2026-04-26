import React, { useState } from 'react'
import "../style/register.scss";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';


const Register = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [username,setUsername] = useState("");

  const {handleRegister,loading} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try{
          await handleRegister({email,password,username});
          navigate("/");
      }catch(error){
          console.log(error);
      }
  }

  return (
    <main className='register-page'>
        <div className="form-container">
            <div className="auth-header">
                <h1>Welcome to <span>MoodSync</span></h1>
                <p>Create an account to get started.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <FormGroup 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label="Username" placeholder="Enter your Username" />
                
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
                
                <button type='submit' className="button">Register</button>
            </form>
            <div className='alt-actions'>
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    </main>
  )
}

export default Register