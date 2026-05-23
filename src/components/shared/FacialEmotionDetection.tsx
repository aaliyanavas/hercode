import { useCallback, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { FACE_TO_CARD, PatientEmotion } from '../../data/emotions';
import styles from './FacialEmotionDetection.module.css';

type Props = {
  onDetected: (emotion: PatientEmotion) => void;
  accentClass?: string;
};

const EXPRESSION_LABELS: Record<string, string> = {
  angry: 'Angry',
  disgusted: 'Disgusted',
  fearful: 'Fearful',
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  surprised: 'Surprised',
};

export default function FacialEmotionDetection({ onDetected, accentClass = '' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [status, setStatus] = useState('');
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const loadModels = useCallback(async () => {
    setStatus('Loading AI models…');
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]);
      setModelsReady(true);
      setStatus('Models ready. Start camera to detect emotions.');
    } catch {
      setStatus('Could not load models. Run: npm run setup-models');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const stream = videoRef.current?.srcObject as MediaStream | undefined;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
    setDetectedLabel(null);
  }, []);

  const startCamera = useCallback(async () => {
    if (!modelsReady || !videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraOn(true);
      setStatus('Detecting… look at the camera');

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      faceapi.matchDimensions(canvas, {
        width: video.videoWidth,
        height: video.videoHeight,
      });

      intervalRef.current = window.setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        const resized = faceapi.resizeResults(detections, {
          width: video.videoWidth,
          height: video.videoHeight,
        });

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvasRef.current, resized);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
        }

        if (detections.length > 0) {
          const expr = detections[0].expressions as unknown as Record<string, number>;
          const top = Object.entries(expr).sort((a, b) => b[1] - a[1])[0];
          if (top) {
            const label = EXPRESSION_LABELS[top[0]] ?? top[0];
            setDetectedLabel(`${label} (${Math.round(top[1] * 100)}%)`);
            const card = FACE_TO_CARD[top[0]];
            if (card) onDetected(card);
          }
        }
      }, 800);
    } catch {
      setStatus('Camera access denied or unavailable.');
    }
  }, [modelsReady, onDetected]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className={styles.wrap}>
      <div className={styles.videoBox}>
        <video ref={videoRef} className={styles.video} muted playsInline />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <p className={styles.status}>{status}</p>
      {detectedLabel && (
        <span className={`${styles.detected} ${accentClass}`}>Detected: {detectedLabel}</span>
      )}
      <div className={styles.btnRow}>
        {!modelsReady && (
          <button type="button" className={styles.btnPrimary} onClick={loadModels}>
            Load Camera
          </button>
        )}
        {modelsReady && !cameraOn && (
          <button type="button" className={styles.btnPrimary} onClick={startCamera}>
            Start camera
          </button>
        )}
        {cameraOn && (
          <button type="button" className={styles.btnSecondary} onClick={stopCamera}>
            Stop camera
          </button>
        )}
      </div>
      <p className={styles.fallback}>
        
      </p>
    </div>
  );
}
