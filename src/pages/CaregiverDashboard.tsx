import { useCallback, useEffect, useState } from 'react';
import DashboardLayout, { SectionCard } from '../components/shared/DashboardLayout';
import EmotionCards from '../components/shared/EmotionCards';
import ConstellationJourney from '../components/shared/ConstellationJourney';
import {
  CAREGIVER_EMOTION_CARDS,
  CAREGIVER_AI_RESPONSES,
  CaregiverEmotion,
} from '../data/emotions';
import {
  buildCommunicationPhrases,
  summarizeAppointmentConcerns,
} from '../utils/aiHelpers';
import { useConstellation } from '../hooks/useConstellation';
import styles from './CaregiverDashboard.module.css';

const STORAGE_SUMMARY = 'between-us-appointment-summary';
const STORAGE_STRESS = 'between-us-caregiver-stress';

export default function CaregiverDashboard() {
  const { totalStars, unlocked, addStar } = useConstellation('caregiver');
  const [showSummary, setShowSummary] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [commInput, setCommInput] = useState('');
  const [phrases, setPhrases] = useState<string[]>([]);
  const [stressCount, setStressCount] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);

  useEffect(() => {
    const notes = localStorage.getItem(STORAGE_SUMMARY);
    if (notes) {
      setPatientNotes(notes);
      setSummary(summarizeAppointmentConcerns(notes));
    }
    const stress = localStorage.getItem(STORAGE_STRESS);
    if (stress) {
      try {
        const { count, level } = JSON.parse(stress) as { count: number; level: number };
        setStressCount(count);
        setStressLevel(level);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const handleEmotionSelect = useCallback(
    (emotion: CaregiverEmotion) => {
      addStar();
      const heavy: CaregiverEmotion[] = ['exhausted', 'overwhelmed', 'worried', 'numb'];
      if (heavy.includes(emotion)) {
        setStressCount((c) => {
          const next = c + 1;
          const level = Math.min(100, next * 15);
          setStressLevel(level);
          localStorage.setItem(STORAGE_STRESS, JSON.stringify({ count: next, level }));
          return next;
        });
      }
    },
    [addStar],
  );

  const savePatientNotes = () => {
    localStorage.setItem(STORAGE_SUMMARY, patientNotes);
    setSummary(summarizeAppointmentConcerns(patientNotes));
  };

  const handleHighlight = () => {
    const sel = window.getSelection()?.toString();
    if (sel) {
      setPatientNotes((n) => `${n}\n\nCaregiver question: ${sel}`);
      savePatientNotes();
    }
  };

  const generatePhrases = () => {
    setPhrases(buildCommunicationPhrases(commInput));
  };

  const burnoutMessage =
    stressLevel >= 45
      ? "You've sounded emotionally drained recently. Consider reaching out to support resources."
      : stressCount > 0
        ? 'Keep checking in with yourself — your wellbeing matters too.'
        : 'Log how you feel over time to spot burnout patterns early.';

  return (
    <DashboardLayout title="Caregiver Space" themeClass={styles.caregiverTheme}>
      <SectionCard
        title="How are YOU?"
        subtitle="Your feelings matter — not only the person you care for"
        className={styles.cardCaregiver}
      >
        <EmotionCards
          emotions={CAREGIVER_EMOTION_CARDS}
          responses={CAREGIVER_AI_RESPONSES}
          onSelect={handleEmotionSelect}
          chipClass={styles.chipCaregiver}
          activeClass={styles.chipCaregiverActive}
          aiBoxClass={styles.aiCaregiver}
        />
      </SectionCard>

      <SectionCard
        title="Shared appointment prep"
        subtitle="One-page summary after each visit — highlight to add your questions"
        className={styles.cardCaregiver}
      >
        <textarea
          className={styles.input}
          placeholder="Patient concerns from appointment (demo: paste or type notes)…"
          value={patientNotes}
          onChange={(e) => setPatientNotes(e.target.value)}
        />
        <button type="button" className={styles.btnCaregiver} onClick={savePatientNotes}>
          Save & summarize
        </button>
        <button
          type="button"
          className={styles.btnCaregiver}
          style={{ marginLeft: '0.5rem' }}
          onClick={() => setShowSummary((s) => !s)}
        >
          {showSummary ? 'Hide summary' : 'View appointment summary'}
        </button>
        {showSummary && summary && (
          <div className={styles.summaryBox} onMouseUp={handleHighlight}>
            {summary}
            <p className={styles.highlightNote}>
              Highlight any line and release — it will be added as a caregiver question.
            </p>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Communication assistant"
        subtitle="Supportive phrasing for difficult conversations"
        className={styles.cardCaregiver}
      >
        <textarea
          className={styles.input}
          placeholder='e.g. "How do I talk to my mother without sounding worried?"'
          value={commInput}
          onChange={(e) => setCommInput(e.target.value)}
        />
        <button type="button" className={styles.btnCaregiver} onClick={generatePhrases}>
          Get phrasing help
        </button>
        {phrases.length > 0 && (
          <ul className={styles.phrases}>
            {phrases.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Burnout detection"
        subtitle="Tracks emotional exhaustion patterns over check-ins"
        className={styles.cardCaregiver}
      >
        <div className={styles.stressRow}>
          <span className={styles.stressLabel}>Stress</span>
          <div className={styles.stressBar}>
            <div className={styles.stressFill} style={{ width: `${stressLevel}%` }} />
          </div>
          <span className={styles.stressLabel}>{stressLevel}%</span>
        </div>
        <div className={styles.burnoutAlert}>{burnoutMessage}</div>
      </SectionCard>

      <SectionCard
        title="Constellation Journey ⭐"
        subtitle="Your own night sky — each check-in lights a star"
        className={styles.cardCaregiver}
      >
        <ConstellationJourney totalStars={totalStars} unlocked={unlocked} />
      </SectionCard>
    </DashboardLayout>
  );
}
