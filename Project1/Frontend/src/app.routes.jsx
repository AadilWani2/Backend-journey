import {createBrowserRouter} from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Feed from './features/posts/pages/Feed'
import CreatePost from './features/posts/pages/CreatePost'

import SearchUsers from './features/users/pages/SearchUsers'
import Profile from './features/users/pages/Profile'

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Feed/>
    },
    {
        path:"/create-post",
        element:<CreatePost/>
    },
    {
        path:"/search",
        element:<SearchUsers/>
    },
    {
        path:"/profile",
        element:<Profile/>
    }
])

