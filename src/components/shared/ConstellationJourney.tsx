import { useMemo } from 'react';
import { CONSTELLATION_THEMES } from '../../data/constellations';
import styles from './ConstellationJourney.module.css';

type Theme = (typeof CONSTELLATION_THEMES)[number];

type Props = {
  totalStars: number;
  unlocked: Theme[];
};

function starPositions(count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / Math.max(count, 1)) * Math.PI * 2 + 0.3;
    const r = 25 + (i % 3) * 12;
    positions.push({
      x: 50 + Math.cos(angle) * r * 0.4,
      y: 45 + Math.sin(angle) * r * 0.35,
    });
  }
  return positions;
}

export default function ConstellationJourney({ totalStars, unlocked }: Props) {
  const stars = useMemo(() => starPositions(Math.min(totalStars, 24)), [totalStars]);

  const linePoints =
    stars.length >= 2
      ? stars.map((s) => `${s.x},${s.y}`).join(' ')
      : '';

  return (
    <div>
      <p className={styles.count}>
        {totalStars} star{totalStars !== 1 ? 's' : ''} lit — each check-in adds light to your sky
      </p>
      <div className={styles.sky}>
        <div className={styles.starField}>
          {stars.map((s, i) => (
            <span
              key={i}
              className={styles.star}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        {linePoints && (
          <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={linePoints}
              fill="none"
              stroke="rgba(201, 160, 220, 0.5)"
              strokeWidth="0.4"
            />
          </svg>
        )}
      </div>
      <div className={styles.themes}>
        {CONSTELLATION_THEMES.map((theme) => {
          const isUnlocked = unlocked.some((u: Theme) => u.id === theme.id);
          return (
            <span
              key={theme.id}
              className={isUnlocked ? styles.badge : `${styles.badge} ${styles.badgeLocked}`}
            >
              {theme.name}
              {!isUnlocked && ` (${theme.starsNeeded}★)`}
            </span>
          );
        })}
      </div>
    </div>
  );
}
