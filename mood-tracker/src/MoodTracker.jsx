import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";

export default function MoodTracker() {
  const videoRef = useRef(null);

  const [mood, setMood] = useState("Loading Models...");

  useEffect(() => {
    startApp();
  }, []);

  async function startApp() {
    // Load face-api models
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");

    // Load MediaPipe
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    const detector = await FaceLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
        },
        runningMode: "VIDEO",
        numFaces: 1
      }
    );

    startCamera(detector);
  }

  async function startCamera(detector) {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true
      });

    videoRef.current.srcObject = stream;

    videoRef.current.onloadedmetadata = () => {
      videoRef.current.play();
      detectLoop(detector);
    };
  }

  function detectLoop(detector) {
    const detect = async () => {
      const video = videoRef.current;

      if (!video) return;

      // -----------------------------
      // MediaPipe landmarks
      // -----------------------------
      const result = detector.detectForVideo(
        video,
        performance.now()
      );

      let smileWidth = 0;
      let eyeGap = 0;

      if (result.faceLandmarks.length > 0) {
        const points = result.faceLandmarks[0];

        const leftMouth = points[61];
        const rightMouth = points[291];

        const eyeTop = points[159];
        const eyeBottom = points[145];

        // Smile width
        smileWidth =
          rightMouth.x - leftMouth.x;

        // Eye openness
        eyeGap = Math.abs(
          eyeTop.y - eyeBottom.y
        );
      }

      // -----------------------------
      // face-api emotion detection
      // -----------------------------
      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detection) {
        const exp = detection.expressions;

        const finalMood = getMood(
          exp,
          smileWidth,
          eyeGap
        );

        setMood(finalMood);
      } else {
        setMood("No Face");
      }

      requestAnimationFrame(detect);
    };

    detect();
  }

  function getMood(exp, smileWidth, eyeGap) {
    // Better happy logic
    if (exp.happy > 0.45 || smileWidth > 0.26) {
      return "😊 Happy";
    }

    if (exp.surprised > 0.55) {
      return "😲 Surprised";
    }

    if (exp.sad > 0.5) {
      return "😟 Sad";
    }

    if (exp.angry > 0.5) {
      return "😠 Angry";
    }

    if (eyeGap < 0.010) {
      return "😴 Tired";
    }

    return "😐 Neutral";
  }

  return (
    <div className="container">
      <h1>AI Mood Tracker</h1>

      <h2>{mood}</h2>

      <div className="camera-box">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
        />
      </div>
    </div>
  );
}