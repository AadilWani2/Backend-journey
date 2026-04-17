import React, { useState } from 'react'
import "../style/form.scss"
import {Link,useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth'


const Login = () => {

    const {user,handleLogin,loading} = useAuth()
    const navigate = useNavigate()

    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(username,password)
        navigate("/")
        
    }

    if(loading){
        return (
            <main>
                <h2>Loading...</h2>
            </main>
        )
    }

    

  return (
    <main>
        <div className="form-container">
            <h1 className="brand-title">Aura</h1>
            <h2>Welcome Back</h2>
            <form onSubmit={handleSubmit}>
                <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                name='username' 
                placeholder='Username' 
                id='username' 
                required />

                <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
                name='password' 
                placeholder='Password' 
                id='password' 
                required />

                <button className='button primary-button'
                type='submit'>Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Create One</Link></p>
        </div>
    </main>
  )
}

export default Login