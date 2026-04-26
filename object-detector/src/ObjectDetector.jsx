import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export default function ObjectDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("Loading AI Model...");

  useEffect(() => {
    startDetector();
  }, []);

  async function startDetector() {
    // Load object model
    const model = await cocoSsd.load();

    setStatus("Starting Camera...");

    // Start webcam
    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true
      });

    videoRef.current.srcObject = stream;

    videoRef.current.onloadedmetadata = () => {
      videoRef.current.play();
      setStatus("Detecting...");
      detectLoop(model);
    };
  }

  function detectLoop(model) {
    const detect = async () => {
      const video = videoRef.current;

      if (!video) return;

      // Detect objects
      const predictions =
        await model.detect(video);

      drawResults(predictions);

      requestAnimationFrame(detect);
    };

    detect();
  }

  function drawResults(predictions) {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    predictions.forEach((item) => {
      const [x, y, width, height] = item.bbox;

      // Box
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Label background
      ctx.fillStyle = "lime";
      ctx.fillRect(x, y - 28, 170, 28);

      // Text
      ctx.fillStyle = "black";
      ctx.font = "18px Arial";

      ctx.fillText(
        `${item.class} ${Math.round(
          item.score * 100
        )}%`,
        x + 5,
        y - 8
      );
    });
  }

  return (
    <div className="container">
      <h1>AI Object Detector</h1>

      <h2>{status}</h2>

      <div className="camera-box">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
        />

        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}