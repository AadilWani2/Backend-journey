import React, { useRef, useState } from "react";
import { useSong } from "../hooks/useSong";
import "./UploadSongModal.scss";

const MOODS = ["happy", "sad", "surprised", "neutral"];

const UploadSongModal = ({ onClose }) => {
    const { handleUploadSong, loading } = useSong();

    const [file, setFile]         = useState(null);
    const [mood, setMood]         = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: "success"|"error", message }
    const fileInputRef = useRef(null);

    // ── file selection ──────────────────────────────────
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) setFile(selected);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped && dropped.type.startsWith("audio/")) setFile(dropped);
    };

    // ── submit ──────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);

        if (!file) return setFeedback({ type: "error", message: "Please select a song file." });
        if (!mood) return setFeedback({ type: "error", message: "Please select a mood." });

        const result = await handleUploadSong({ file, mood });

        if (result.success) {
            setFeedback({ type: "success", message: "Song uploaded successfully! 🎵" });
            setTimeout(() => onClose(), 1500);
        } else {
            setFeedback({ type: "error", message: result.message || "Upload failed." });
        }
    };

    // ── backdrop click closes ───────────────────────────
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="upload-overlay" onClick={handleOverlayClick}>
            <div className="upload-modal">

                {/* header */}
                <div className="upload-header">
                    <h2 className="upload-title">Upload Song</h2>
                    <button className="upload-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <form className="upload-form" onSubmit={handleSubmit}>

                    {/* file dropzone */}
                    <div className="upload-field">
                        <label className="upload-label">Song File</label>
                        <div
                            className={`upload-dropzone${dragOver ? " upload-dropzone--active" : ""}`}
                            onClick={() => fileInputRef.current.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="audio/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <div className="upload-dropzone-icon">🎵</div>
                            <p className="upload-dropzone-text">
                                Drag & drop or <span>browse</span>
                            </p>
                            {file && (
                                <p className="upload-file-name">✓ {file.name}</p>
                            )}
                        </div>
                    </div>

                    {/* mood select */}
                    <div className="upload-field">
                        <label className="upload-label" htmlFor="mood-select">Mood</label>
                        <select
                            id="mood-select"
                            className="upload-select"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                        >
                            <option value="" disabled>Select a mood…</option>
                            {MOODS.map((m) => (
                                <option key={m} value={m}>
                                    {m.charAt(0).toUpperCase() + m.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* feedback */}
                    {feedback && (
                        <p className={`upload-feedback upload-feedback--${feedback.type}`}>
                            {feedback.message}
                        </p>
                    )}

                    {/* submit */}
                    <button
                        type="submit"
                        className="upload-submit"
                        disabled={loading}
                    >
                        {loading ? "Uploading…" : "Upload Song"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadSongModal;
