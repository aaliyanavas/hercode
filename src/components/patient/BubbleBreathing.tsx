import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './BubbleBreathing.module.css';

/** 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s */
const PHASES = [
  { name: 'Breathe in', duration: 4, scale: 1.4 },
  { name: 'Hold', duration: 7, scale: 1.4 },
  { name: 'Breathe out', duration: 8, scale: 0.7 },
] as const;

type Props = {
  onComplete?: () => void;
};

export default function BubbleBreathing({ onComplete }: Props) {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(PHASES[0].duration);
  const [scale, setScale] = useState(1);
  const cycleCount = useRef(0);

  const phase = PHASES[phaseIndex];

  const tick = useCallback(() => {
    setSecondsLeft((s) => {
      if (s <= 1) {
        const nextPhase = (phaseIndex + 1) % PHASES.length;
        if (nextPhase === 0) {
          cycleCount.current += 1;
          if (cycleCount.current >= 1) {
            onComplete?.();
          }
        }
        setPhaseIndex(nextPhase);
        return PHASES[nextPhase].duration;
      }
      return s - 1;
    });
  }, [phaseIndex, onComplete]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running, tick]);

  useEffect(() => {
    const target = phase.scale;
    const start = scale;
    const duration = phase.duration * 1000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      setScale(start + (target - start) * t);
      if (t < 1 && running) requestAnimationFrame(animate);
    };
    if (running) requestAnimationFrame(animate);
  }, [phaseIndex, running, phase.scale, phase.duration, scale]);

  const start = () => {
    cycleCount.current = 0;
    setPhaseIndex(0);
    setSecondsLeft(PHASES[0].duration);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    setScale(1);
    setPhaseIndex(0);
    setSecondsLeft(PHASES[0].duration);
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.circle}
        style={{ transform: `scale(${scale})` }}
        aria-hidden
      />
      <p className={styles.phase}>{phase.name}</p>
      <p className={styles.timer}>{secondsLeft}</p>
      <p className={styles.hint}>4-7-8 rhythm — complete a cycle to earn a constellation star</p>
      <div className={styles.controls}>
        {!running ? (
          <button type="button" className={styles.btn} onClick={start}>
            Start breathing
          </button>
        ) : (
          <button type="button" className={styles.btn} onClick={stop}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
