import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSong } from "../hooks/useSong";
import "./Player.scss";

/* ─── helpers ─── */
const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/* ─── Icons ─── */
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconPrev = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);
const IconNext = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);
const IconVolumeUp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);
const IconVolumeMute = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);
const IconBack5 = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    <text x="8.5" y="15.5" fontSize="5.5" fontWeight="bold" fill="currentColor">5</text>
  </svg>
);
const IconFwd5 = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2z" />
    <text x="8.5" y="15.5" fontSize="5.5" fontWeight="bold" fill="currentColor">5</text>
  </svg>
);

/* ═══════════════════════════════════════════════ */
const Player = () => {
  const { song, playNextSong, playPrevSong } = useSong();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying]         = useState(false);
  const [currentTime, setCurrentTime]     = useState(0);
  const [duration, setDuration]           = useState(0);
  const [volume, setVolume]               = useState(0.8);
  const [isMuted, setIsMuted]             = useState(false);
  const [speed, setSpeed]                 = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isLoaded, setIsLoaded]           = useState(false);

  if (!song) return null;

  /* load song */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = song.url;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setIsLoaded(false);
    // auto-play: call play() right after load so it's close to the user interaction
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [song.url]);

  /* listeners */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime    = () => setCurrentTime(audio.currentTime);
    const onDur     = () => setDuration(audio.duration);
    const onEnded   = () => {
      setIsPlaying(false);
      playNextSong();
    };
    const onCanPlay = () => setIsLoaded(true);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onDur);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("canplay", onCanPlay);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("durationchange", onDur);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else           { audio.play();  setIsPlaying(true);  }
  }, [isPlaying]);

  const seek = useCallback((delta) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + delta, 0), audio.duration || 0);
  }, []);

  const handleSeekBar = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    audioRef.current.volume = v;
    setIsMuted(v === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) { audio.volume = volume || 0.5; setIsMuted(false); }
    else         { audio.volume = 0;             setIsMuted(true);  }
  };

  const handleSpeed = (s) => {
    audioRef.current.playbackRate = s;
    setSpeed(s);
    setShowSpeedMenu(false);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      <div className="player-wrapper">
      <div className="player-bar">

        {/* ── LEFT: art + info ── */}
        <div className="player-left">
          <img
            src={song.posterURL}
            alt={song.title}
            className={`player-thumb${isPlaying ? " player-thumb--playing" : ""}`}
          />
          <div className="player-info">
            <h2 className="player-title">{song.title}</h2>
            {song.mood && (
              <span className="player-mood">✦ {song.mood.toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* ── CENTER: controls + seek ── */}
        <div className="player-center">
          {/* buttons */}
          <div className="player-controls">
            <button className="player-icon-btn" onClick={playPrevSong} title="Previous Track" aria-label="Previous Track">
              <IconPrev />
            </button>
            <button className="player-icon-btn" onClick={() => seek(-5)} title="Back 5s" aria-label="Rewind 5 seconds">
              <IconBack5 />
            </button>
            <button
              className="player-play-btn"
              onClick={togglePlay}
              disabled={!isLoaded}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
            <button className="player-icon-btn" onClick={() => seek(5)} title="Forward 5s" aria-label="Forward 5 seconds">
              <IconFwd5 />
            </button>
            <button className="player-icon-btn" onClick={playNextSong} title="Next Track" aria-label="Next Track">
              <IconNext />
            </button>
          </div>

          {/* seek row */}
          <div className="player-seek-row">
            <span className="player-time">{fmt(currentTime)}</span>
            <div className="player-seek-wrap" onClick={handleSeekBar}>
              <div className="player-seek-track">
                <div className="player-seek-fill" style={{ width: `${progress}%` }} />
                <div className="player-seek-thumb" style={{ left: `calc(${progress}% - 6px)` }} />
              </div>
            </div>
            <span className="player-time">{fmt(duration)}</span>
          </div>
        </div>

        {/* ── RIGHT: volume + speed ── */}
        <div className="player-right">
          <button className="player-vol-btn" onClick={toggleMute} aria-label="Toggle mute">
            {isMuted ? <IconVolumeMute /> : <IconVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            className="player-vol-range"
            aria-label="Volume"
          />

          <div className="player-speed-wrap">
            <button
              className="player-speed-btn"
              onClick={() => setShowSpeedMenu((v) => !v)}
              aria-label="Playback speed"
            >
              {speed}×
            </button>
            {showSpeedMenu && (
              <div className="player-speed-menu">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    className={`player-speed-item${s === speed ? " player-speed-item--active" : ""}`}
                    onClick={() => handleSpeed(s)}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      </div>
    </>
  );
};

export default Player;