import React, {
  useRef,
  useState,
  useEffect
} from "react";

export default function App() {
  const videoRef = useRef(null);

  const [result, setResult] =
    useState("Starting camera...");

  useEffect(() => {
    startCamera();
  }, []);

  // Start webcam automatically
  async function startCamera() {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true
        });

      videoRef.current.srcObject =
        stream;

      videoRef.current.onloadedmetadata =
        () => {
          videoRef.current.play();

          // Start scanning
          autoDetect();
        };
    } catch {
      setResult(
        "Camera permission denied"
      );
    }
  }

  // Scan every 3 sec
  function autoDetect() {
    setInterval(() => {
      scanObject();
    }, 3000);
  }

  // Capture frame and send
  async function scanObject() {
    if (!videoRef.current) return;

    if (
      videoRef.current.videoWidth ===
      0
    )
      return;

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
      0,
      canvas.width,
      canvas.height
    );

    const image =
      canvas.toDataURL(
        "image/jpeg"
      );

    try {
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

      if (
        Array.isArray(data) &&
        data[0]?.generated_text
      ) {
        setResult(
          data[0].generated_text
        );
      } else if (
        data.error
      ) {
        setResult(
          data.error
        );
      } else {
        setResult(
          "Nothing detected"
        );
      }
    } catch {
      setResult(
        "Server error"
      );
    }
  }

  return (
    <div style={styles.page}>
      <h1>
        AI Auto Detector
      </h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={styles.video}
      />

      <h2 style={styles.text}>
        {result}
      </h2>
    </div>
  );
}

const styles = {
  page: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial"
  },

  video: {
    width: "760px",
    maxWidth: "95vw",
    borderRadius: "14px",
    marginTop: "20px"
  },

  text: {
    marginTop: "20px",
    color: "#38bdf8"
  }
};