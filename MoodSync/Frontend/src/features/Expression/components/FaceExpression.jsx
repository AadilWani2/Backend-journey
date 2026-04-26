import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";
import "./FaceExpression.scss";

const MOOD_EMOJI = {
  happy:     "😄",
  sad:       "😢",
  surprised: "😲",
  neutral:   "😐",
  "Detecting...": "👁️",
};

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef     = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef    = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {
    init({ landmarkerRef, videoRef, streamRef });
    return () => {
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  async function handleClick() {
    const expr = detect({ landmarkerRef, videoRef, setExpression });
    onClick(expr);
  }

  const emoji = MOOD_EMOJI[expression] ?? "🎵";

  return (
    <section className="face-section">
      <div className="face-heading">
        <h1>
          Mood<span>Sync</span>
        </h1>
        <p>Let your face pick the vibe — we'll find the perfect song.</p>
      </div>

      <div className="face-video-wrap">
        <video ref={videoRef} playsInline />
      </div>

      <div className="face-mood-badge">
        <span className="face-mood-dot" />
        {emoji} &nbsp;{expression.charAt(0).toUpperCase() + expression.slice(1)}
      </div>

      <button className="face-detect-btn" onClick={handleClick}>
        Detect My Mood
      </button>
    </section>
  );
}