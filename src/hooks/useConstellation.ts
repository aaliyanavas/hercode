import { useCallback, useEffect, useState } from 'react';
import { CONSTELLATION_THEMES } from '../data/constellations';

const STORAGE_PREFIX = 'between-us-stars-';

export function useConstellation(role: 'patient' | 'caregiver') {
  const key = `${STORAGE_PREFIX}${role}`;
  const [starCount, setStarCount] = useState(0);
  const [breathingStars, setBreathingStars] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const data = JSON.parse(raw) as { stars: number; breathing: number };
        setStarCount(data.stars ?? 0);
        setBreathingStars(data.breathing ?? 0);
      } catch {
        /* ignore */
      }
    }
  }, [key]);

  const persist = useCallback(
    (stars: number, breathing: number) => {
      localStorage.setItem(key, JSON.stringify({ stars, breathing }));
    },
    [key],
  );

  const addStar = useCallback(() => {
    setStarCount((n) => {
      const next = n + 1;
      persist(next, breathingStars);
      return next;
    });
  }, [breathingStars, persist]);

  const addBreathingStar = useCallback(() => {
    setStarCount((s) => {
      const nextStars = s + 1;
      setBreathingStars((b) => {
        const nextBreathing = b + 1;
        persist(nextStars, nextBreathing);
        return nextBreathing;
      });
      return nextStars;
    });
  }, [persist]);

  const totalStars = starCount;
  const unlocked = CONSTELLATION_THEMES.filter((c) => totalStars >= c.starsNeeded);

  return { totalStars, unlocked, addStar, addBreathingStar, breathingStars };
}
