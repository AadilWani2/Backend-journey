import { useContext } from "react";
import { getSong, uploadSong } from "../service/song.api";
import { songContext } from "../song.context";

export const useSong = () => {

    const context = useContext(songContext);
    
    const {
        loading, setLoading, 
        song, setSong, 
        currentMood, setCurrentMood,
        playlist, setPlaylist,
        currentIndex, setCurrentIndex
    } = context;

    async function handleGetSong(mood){
        try{
            setLoading(true);
            setCurrentMood(mood.mood);
            const data = await getSong(mood);
            if(data.songs && data.songs.length > 0){
                // Shuffle array to randomize playlist
                const shuffled = [...data.songs].sort(() => 0.5 - Math.random());
                setPlaylist(shuffled);
                setCurrentIndex(0);
                setSong(shuffled[0]);
                return true;
            } else {
                throw new Error(data.message || "No songs found");
            }
        }
        catch(err){
            console.log(err);
            return false;
        }
        finally{
            setLoading(false);                
        }
    }

    async function handleUploadSong({ file, mood }) {
        try {
            setLoading(true);
            const data = await uploadSong({ file, mood });
            if (data.song) {
                return { success: true };
            } else {
                throw new Error(data.message || "Upload failed");
            }
        } catch (err) {
            console.log(err);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    }

    function playNextSong() {
        if (playlist.length === 0) return;
        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentIndex(nextIndex);
        setSong(playlist[nextIndex]);
    }

    function playPrevSong() {
        if (playlist.length === 0) return;
        const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        setSong(playlist[prevIndex]);
    }

    return ({
        loading,
        song,
        currentMood,
        playlist,
        currentIndex,
        handleGetSong,
        handleUploadSong,
        playNextSong,
        playPrevSong,
    })
}