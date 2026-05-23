import { useState } from 'react';
import styles from './EmotionCards.module.css';

type Props<T extends string> = {
  emotions: readonly T[];
  responses: Record<T, string>;
  onSelect?: (emotion: T) => void;
  chipClass?: string;
  activeClass?: string;
  aiBoxClass?: string;
};

export default function EmotionCards<T extends string>({
  emotions,
  responses,
  onSelect,
  chipClass = '',
  activeClass = '',
  aiBoxClass = '',
}: Props<T>) {
  const [selected, setSelected] = useState<T | null>(null);

  const handleSelect = (e: T) => {
    setSelected(e);
    onSelect?.(e);
  };

  return (
    <div>
      <div className={styles.grid}>
        {emotions.map((e) => (
          <button
            key={e}
            type="button"
            className={`${styles.chip} ${chipClass} ${selected === e ? `${styles.chipActive} ${activeClass}` : ''}`}
            onClick={() => handleSelect(e)}
          >
            {e}
          </button>
        ))}
      </div>
      {selected && (
        <div className={`${styles.aiBox} ${aiBoxClass}`}>
          {responses[selected]}
        </div>
      )}
    </div>
  );
}
