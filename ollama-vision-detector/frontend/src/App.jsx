import React, {
  useRef,
  useEffect,
  useState
} from "react";

export default function App() {
  const videoRef = useRef(null);

  const [result, setResult] =
    useState("Ready");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject =
          stream;
      })
      .catch(() =>
        setResult(
          "Camera permission denied"
        )
      );
  }, []);

  async function analyze() {
    try {
      setLoading(true);
      setResult("Analyzing...");

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        videoRef.current.videoWidth;

      canvas.height =
        videoRef.current.videoHeight;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(
        videoRef.current,
        0,
        0
      );

      const image =
        canvas.toDataURL(
          "image/jpeg",
          0.8
        );

      const res = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            image
          })
        }
      );

      const data =
        await res.json();

      setResult(
        data.result ||
          data.error ||
          "No result"
      );
    } catch {
      setResult(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Local Vision AI
        </h1>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={styles.video}
        />

        <button
          onClick={analyze}
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Analyzing..."
            : "Analyze"}
        </button>

        <div style={styles.result}>
          {result}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100%",
    margin: 0,
    padding: "10px",
    overflow: "hidden",
    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    height: "96vh",
    background:
      "rgba(255,255,255,0.06)",
    backdropFilter:
      "blur(12px)",
    borderRadius: "20px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxSizing: "border-box",
    color: "white"
  },

  title: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px"
  },

  video: {
    width: "100%",
    flex: 1,
    minHeight: 0,
    objectFit: "cover",
    borderRadius: "16px",
    border:
      "1px solid rgba(255,255,255,0.1)"
  },

  button: {
    padding: "12px",
    border: "none",
    borderRadius: "14px",
    background: "#38bdf8",
    color: "#000",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer"
  },

  result: {
    minHeight: "60px",
    maxHeight: "90px",
    overflowY: "auto",
    background:
      "rgba(255,255,255,0.05)",
    borderRadius: "14px",
    padding: "12px",
    fontSize: "16px",
    lineHeight: "1.4"
  }
};