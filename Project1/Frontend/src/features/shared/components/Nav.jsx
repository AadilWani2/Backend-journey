import React from 'react'
import "../nav.scss"
import { useNavigate, useLocation } from 'react-router'

const Nav = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname;

  return (
    <>
        <nav className='top-nav'>
            <p className="logo">Aura</p>
        </nav>

        <nav className='bottom-nav'>
            <button className={path === "/" ? "active" : ""} onClick={() => navigate("/")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            </button>
            <button className={path === "/search" ? "active" : ""} onClick={() => navigate("/search")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
            </button>
            <button className={path === "/create-post" ? "active" : ""} onClick={() => navigate("/create-post")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/></svg>
            </button>
            <button className={path === "/profile" ? "active" : ""} onClick={() => navigate("/profile")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>
            </button>
        </nav>
    </>
  )
}

export default Nav