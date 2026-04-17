import React from 'react'
import {Link,useNavigate} from 'react-router'
import {useAuth} from '../hooks/useAuth' 
import {useState} from 'react'

const Register = () => {
    const {handleRegister,loading} = useAuth()
    const navigate = useNavigate()

    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

   const handleSubmit = async (e) => {
        e.preventDefault();

        await handleRegister(username,email,password)
        navigate("/")
       
        if(loading){
          return(
            <main>
                <h2>Loading...</h2>
            </main>
          )
        }
    }


  return (
    <main>
        <div className="form-container">
            <h1 className="brand-title">Aura</h1>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text" name='username' placeholder='Username' id='username' required />
                <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" name='email' placeholder='Email' id='email' required />
                <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" name='password' placeholder='Password' id='password' required />
                <button className='button primary-button' type='submit'>Create Account</button>
            </form>
            <p>Already have an account? <Link to="/login">Login to your account</Link></p>
        </div>
    </main>
  )
}

export default Register