import { createContext, useState } from "react";

export const songContext = createContext();

export const SongContextProvider = ({children}) => {
    const [song, setSong] = useState(null);

    const [loading, setLoading] = useState(false);
    const [currentMood, setCurrentMood] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    return(
        <songContext.Provider value={{
            loading, setLoading, 
            song, setSong, 
            currentMood, setCurrentMood,
            playlist, setPlaylist,
            currentIndex, setCurrentIndex
        }}>
            {children}
        </songContext.Provider>
    )

}
    