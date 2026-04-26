import React from "react";
import { useSong } from "../hooks/useSong";
import "./Playlist.scss";

const Playlist = ({ isOpen, onToggle }) => {
  const { playlist, currentIndex, currentMood, setSong, setCurrentIndex } = useSong();

  if (!playlist || playlist.length === 0) return null;

  return (
    <>
      <button 
        className={`playlist-toggle-btn ${isOpen ? 'playlist-toggle-btn--open' : ''}`}
        onClick={onToggle}
        aria-label="Toggle Playlist"
      >
        {isOpen ? '▶' : '◀'}
      </button>

      <div className={`playlist-container ${isOpen ? 'playlist-container--open' : 'playlist-container--closed'}`}>
      <div className="playlist-header">
        <h2>Up Next</h2>
        <span className="playlist-mood-badge">{currentMood} vibes</span>
      </div>

      <ul className="playlist-list">
        {playlist.map((item, index) => {
          const isPlaying = index === currentIndex;
          const isPlayed = index < currentIndex;

          return (
            <li
              key={item._id || index}
              className={`playlist-item ${isPlaying ? "playlist-item--playing" : ""} ${
                isPlayed ? "playlist-item--played" : ""
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setSong(playlist[index]);
              }}
            >
              <div className="playlist-item-thumb-wrap">
                <img src={item.posterURL} alt={item.title} className="playlist-item-thumb" />
                {isPlaying && (
                  <div className="playlist-item-eq">
                    <span></span><span></span><span></span>
                  </div>
                )}
              </div>
              <div className="playlist-item-info">
                <p className="playlist-item-title">{item.title}</p>
                <p className="playlist-item-status">
                  {isPlaying ? "Now Playing" : isPlayed ? "Played" : "Coming Up"}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      </div>
    </>
  );
};

export default Playlist;
