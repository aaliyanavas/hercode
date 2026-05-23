import { useCallback, useState } from 'react';
import DashboardLayout, { SectionCard } from '../components/shared/DashboardLayout';
import FacialEmotionDetection from '../components/shared/FacialEmotionDetection';
import EmotionCards from '../components/shared/EmotionCards';
import ConstellationJourney from '../components/shared/ConstellationJourney';
import BubbleBreathing from '../components/patient/BubbleBreathing';
import {
  PATIENT_EMOTION_CARDS,
  PATIENT_AI_RESPONSES,
  PatientEmotion,
} from '../data/emotions';
import { MESSAGE_BOTTLES } from '../data/messageBottles';
import { buildDoctorQuestions } from '../utils/aiHelpers';
import { useConstellation } from '../hooks/useConstellation';
import styles from './PatientDashboard.module.css';

const REFLECTIONS = [
  'What is one small thing that felt manageable today?',
  'If your body could speak, what would it thank you for?',
  'Who or what helps you feel even slightly safer?',
  'What would "enough" look like for today — not perfect, just enough?',
];

export default function PatientDashboard() {
  const { totalStars, unlocked, addStar, addBreathingStar } = useConstellation('patient');
  const [concernInput, setConcernInput] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [bottleIndex, setBottleIndex] = useState<number | null>(null);
  const [unlockedBottles, setUnlockedBottles] = useState(0);
  const [reflectionIndex, setReflectionIndex] = useState(0);

  const handleEmotionSelect = useCallback(() => {
    addStar();
  }, [addStar]);

  const handleFaceDetect = useCallback(
    (_emotion: PatientEmotion) => {
      addStar();
    },
    [addStar],
  );

  const generateQuestions = () => {
    const qs = buildDoctorQuestions(concernInput);
    setQuestions(qs);
    if (concernInput.trim()) {
      localStorage.setItem('between-us-appointment-summary', concernInput.trim());
    }
  };

  const unlockBottle = () => {
    const next = (bottleIndex ?? -1) + 1;
    if (next < MESSAGE_BOTTLES.length) {
      setBottleIndex(next);
      setUnlockedBottles(next + 1);
      addStar();
    }
  };

  const nextReflection = () => {
    setReflectionIndex((i) => (i + 1) % REFLECTIONS.length);
    addStar();
  };

  return (
    <DashboardLayout title="Patient Space" themeClass={styles.patientTheme}>
      <SectionCard
        title="Mood Check-In"
        subtitle=""
        className={styles.cardPatient}
      >
        <FacialEmotionDetection
          onDetected={handleFaceDetect}
          accentClass={styles.detectedPatient}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <p className="sub" style={{ marginBottom: '0.75rem' }}>
            Daily Emotion Cards
          </p>
          <EmotionCards
            emotions={PATIENT_EMOTION_CARDS}
            responses={PATIENT_AI_RESPONSES}
            onSelect={handleEmotionSelect}
            chipClass={styles.chipPatient}
            activeClass={styles.chipPatientActive}
            aiBoxClass={styles.aiPatient}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Doctor Question Builder"
        subtitle=""
        className={styles.cardPatient}
      >
        <textarea
          className={styles.input}
          placeholder={"e.g. I'm afraid chemo isn't working."}
          value={concernInput}
          onChange={(e) => setConcernInput(e.target.value)}
        />
        <button type="button" className={styles.unlockBtn} onClick={generateQuestions}>
          Build Questions
        </button>
        {questions.length > 0 && (
          <ul className={styles.questions}>
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Message Bottles 💌" className={styles.cardPatient}>
        <div className={styles.bottle}>
          {bottleIndex !== null
            ? MESSAGE_BOTTLES[bottleIndex]
            : 'Unlock a supportive anonymous message'}
        </div>
        <button
          type="button"
          className={styles.unlockBtn}
          onClick={unlockBottle}
          disabled={unlockedBottles >= MESSAGE_BOTTLES.length}
        >
          {unlockedBottles >= MESSAGE_BOTTLES.length
            ? 'All bottles opened'
            : 'Open a bottle'}
        </button>
      </SectionCard>

      <SectionCard title="Calm Corner" className={styles.cardPatient}>
        <div className={styles.calmGrid}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Bubble Breathing</h3>
            <BubbleBreathing onComplete={addBreathingStar} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Calming Sounds</h3>
            <p className="sub">
              Gentle playlists to help you settle — open in Spotify when you need background calm.
            </p>
            <a
              className={styles.soundLink}
              href="https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Spotify calming sounds →
            </a>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Guided Reflection</h3>
            <p className={styles.reflection}>{REFLECTIONS[reflectionIndex]}</p>
            <button type="button" className={styles.reflectionBtn} onClick={nextReflection}>
              Next Reflection
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Constellation Journey ⭐"
        subtitle="Each check-in lights a star — constellations grow into themes of resilience"
        className={styles.cardPatient}
      >
        <ConstellationJourney totalStars={totalStars} unlocked={unlocked} />
      </SectionCard>
    </DashboardLayout>
  );
}
