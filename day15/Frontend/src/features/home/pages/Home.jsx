import React, { useState } from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import Playlist from '../components/Playlist'
import UploadSongModal from '../components/UploadSongModal'
import { useSong } from '../hooks/useSong'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router'
import "./Home.scss"

const Home = () => {
  const { handleGetSong } = useSong();
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);

  const handleMoodDetected = async (expression) => {
    const success = await handleGetSong({ mood: expression });
    if (success) {
      setShowPlayer(true);
    } else {
      alert(`No songs found for mood: ${expression}. Please upload some!`);
    }
  };

  return (
    <div className="home-page">

      {/* top-left logout button */}
      <button
        className="home-logout-btn"
        onClick={async () => {
          await handleLogout();
          navigate('/login');
        }}
        aria-label="Logout"
      >
        <span className="home-logout-btn__icon">←</span>
        Logout
      </button>

      {/* top-right upload button */}
      <button
        className="home-upload-btn"
        onClick={() => setShowUpload(true)}
        aria-label="Upload a song"
      >
        <span className="home-upload-btn__icon">♪</span>
        Upload Song
      </button>

      <div className="home-main">
        <FaceExpression onClick={handleMoodDetected} />

        {showPlayer && (
          <div className="home-player-section">
            <p className="home-player-label">Now Playing</p>
            <Player />
          </div>
        )}
      </div>

      <Playlist isOpen={showPlaylist} onToggle={() => setShowPlaylist(!showPlaylist)} />

      {showUpload && <UploadSongModal onClose={() => setShowUpload(false)} />}
    </div>
  )
}

export default Home