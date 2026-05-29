import { useCallback, useState } from 'react';
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

type Section =
  | 'mood'
  | 'astra'
  | 'bottles'
  | 'calm'
  | 'appointment'
  | 'timeline'
  | 'symptoms'
  | 'progress'
  | 'reflection';

const NAV_GROUPS = [
  {
    group: 'Emotional Support',
    items: [
      { id: 'mood' as Section, label: 'Mood Check-In', icon: '🌸' },
      { id: 'astra' as Section, label: 'Talk to Astra ✨', icon: '✨' },
      { id: 'bottles' as Section, label: 'Message Bottles', icon: '💌' },
      { id: 'calm' as Section, label: 'Calm Corner', icon: '🫧' },
    ],
  },
  {
    group: 'Care Journey',
    items: [
      { id: 'appointment' as Section, label: 'Appointment Copilot', icon: '🩺' },
      { id: 'timeline' as Section, label: 'Timeline', icon: '📅' },
      { id: 'symptoms' as Section, label: 'Symptom Tracker', icon: '📋' },
    ],
  },
  {
    group: 'My Constellation',
    items: [
      { id: 'progress' as Section, label: 'Progress', icon: '⭐' },
      { id: 'reflection' as Section, label: 'Reflection', icon: '🌙' },
    ],
  },
];

export default function PatientDashboard() {
  const { totalStars, unlocked, addStar, addBreathingStar } = useConstellation('patient');
  const [activeSection, setActiveSection] = useState<Section>('mood');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mood / emotion
  const handleEmotionSelect = useCallback(() => addStar(), [addStar]);
  const handleFaceDetect = useCallback((_emotion: PatientEmotion) => addStar(), [addStar]);

  // Appointment copilot
  const [concernInput, setConcernInput] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const generateQuestions = () => {
    const qs = buildDoctorQuestions(concernInput);
    setQuestions(qs);
    if (concernInput.trim()) {
      localStorage.setItem('between-us-appointment-summary', concernInput.trim());
    }
  };

  // Message bottles
  const [bottleIndex, setBottleIndex] = useState<number | null>(null);
  const [unlockedBottles, setUnlockedBottles] = useState(0);
  const unlockBottle = () => {
    const next = (bottleIndex ?? -1) + 1;
    if (next < MESSAGE_BOTTLES.length) {
      setBottleIndex(next);
      setUnlockedBottles(next + 1);
      addStar();
    }
  };

  // Reflection
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const nextReflection = () => {
    setReflectionIndex((i) => (i + 1) % REFLECTIONS.length);
    addStar();
  };

  // Timeline (simple local state)
  const [timelineItems] = useState([
    { date: 'Day 1', label: 'Diagnosis received', done: true },
    { date: 'Week 2', label: 'Surgery consultation', done: true },
    { date: 'Week 4', label: 'First chemo session', done: false },
    { date: 'Week 8', label: 'Follow-up scan', done: false },
  ]);

  // Symptom tracker
  const SYMPTOMS = ['Fatigue', 'Nausea', 'Pain', 'Anxiety', 'Appetite loss', 'Sleep issues'];
  const [symptomLog, setSymptomLog] = useState<Record<string, number>>({});
  const setSymptom = (s: string, v: number) =>
    setSymptomLog((prev) => ({ ...prev, [s]: v }));

  const currentLabel =
    NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === activeSection)?.label ?? '';

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarBrand}>ConstellaCare</span>
          <button
            className={styles.sidebarClose}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.group} className={styles.navGroup}>
              <span className={styles.navGroupLabel}>{group.group}</span>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.navItem} ${activeSection === item.id ? styles.navItemActive : ''}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.starCount}>
            <span className={styles.starIcon}>⭐</span>
            <span>{totalStars} stars earned</span>
          </div>
        </div>
      </aside>

      {/* ── Overlay for mobile ── */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} aria-hidden />
      )}

      {/* ── Main ── */}
      <main className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className={styles.pageTitle}>{currentLabel}</h1>
          <div className={styles.topbarStars}>⭐ {totalStars}</div>
        </header>

        <div className={styles.contentArea}>

          {/* ── MOOD CHECK-IN ── */}
          {activeSection === 'mood' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                Check in with how you're feeling — your face or your words, both are welcome.
              </p>
              <div className={styles.card}>
                <FacialEmotionDetection
                  onDetected={handleFaceDetect}
                  accentClass={styles.detectedPatient}
                />
              </div>
              <div className={styles.card}>
                <p className={styles.cardLabel}>Daily Emotion Cards</p>
                <EmotionCards
                  emotions={PATIENT_EMOTION_CARDS}
                  responses={PATIENT_AI_RESPONSES}
                  onSelect={handleEmotionSelect}
                  chipClass={styles.chipPatient}
                  activeClass={styles.chipPatientActive}
                  aiBoxClass={styles.aiPatient}
                />
              </div>
            </div>
          )}

          {/* ── TALK TO ASTRA ── */}
          {activeSection === 'astra' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                Astra is your gentle AI companion — here to listen without judgment, any time.
              </p>
              <div className={`${styles.card} ${styles.astraCard}`}>
                <div className={styles.astraOrb} aria-hidden>✨</div>
                <p className={styles.astraTagline}>Hi, I'm Astra. What's on your mind today?</p>
                <textarea
                  className={styles.input}
                  placeholder="Share whatever feels right — no wrong answers here…"
                  rows={4}
                />
                <button type="button" className={styles.primaryBtn} onClick={() => addStar()}>
                  Talk to Astra
                </button>
                <p className={styles.astraNote}>
                  Astra listens and reflects — she's not a substitute for medical advice or crisis support.
                </p>
              </div>
            </div>
          )}

          {/* ── MESSAGE BOTTLES ── */}
          {activeSection === 'bottles' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                Supportive messages from others who understand — each bottle holds a piece of someone's heart.
              </p>
              <div className={styles.card}>
                <div className={styles.bottle}>
                  {bottleIndex !== null
                    ? MESSAGE_BOTTLES[bottleIndex]
                    : 'Unlock a supportive anonymous message from someone who has been here too.'}
                </div>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={unlockBottle}
                  disabled={unlockedBottles >= MESSAGE_BOTTLES.length}
                >
                  {unlockedBottles >= MESSAGE_BOTTLES.length ? 'All bottles opened 🌸' : 'Open a bottle 💌'}
                </button>
                <p className={styles.bottleCount}>
                  {unlockedBottles} / {MESSAGE_BOTTLES.length} bottles opened
                </p>
              </div>
            </div>
          )}

          {/* ── CALM CORNER ── */}
          {activeSection === 'calm' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                A quiet space to breathe, ground yourself, and find a moment of calm.
              </p>
              <div className={styles.calmGrid}>
                <div className={styles.card}>
                  <h3 className={styles.cardHeading}>🫧 Bubble Breathing</h3>
                  <BubbleBreathing onComplete={addBreathingStar} />
                </div>
                <div className={styles.card}>
                  <h3 className={styles.cardHeading}>🎵 Calming Sounds</h3>
                  <p className={styles.cardBody}>
                    Gentle playlists to help you settle — open in Spotify when you need background calm.
                  </p>
                  <a
                    className={styles.soundLink}
                    href="https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open calming playlist →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── APPOINTMENT COPILOT ── */}
          {activeSection === 'appointment' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                Turn your worries into clear, confident questions to bring to your next appointment.
              </p>
              <div className={styles.card}>
                <p className={styles.cardLabel}>What's on your mind before your appointment?</p>
                <textarea
                  className={styles.input}
                  placeholder="e.g. I'm afraid the chemo isn't working. I've been feeling more tired than usual…"
                  value={concernInput}
                  onChange={(e) => setConcernInput(e.target.value)}
                  rows={4}
                />
                <button type="button" className={styles.primaryBtn} onClick={generateQuestions}>
                  Build Questions
                </button>
                {questions.length > 0 && (
                  <ul className={styles.questions}>
                    {questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ── TIMELINE ── */}
          {activeSection === 'timeline' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                Your care journey, milestone by milestone. Each step is progress.
              </p>
              <div className={styles.card}>
                <div className={styles.timeline}>
                  {timelineItems.map((item, i) => (
                    <div key={i} className={`${styles.timelineItem} ${item.done ? styles.timelineDone : ''}`}>
                      <div className={styles.timelineDot} />
                      {i < timelineItems.length - 1 && <div className={styles.timelineLine} />}
                      <div className={styles.timelineContent}>
                        <span className={styles.timelineDate}>{item.date}</span>
                        <span className={styles.timelineLabel}>{item.label}</span>
                        {item.done && <span className={styles.timelineBadge}>✓ Done</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SYMPTOM TRACKER ── */}
          {activeSection === 'symptoms' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                Track how you're feeling physically today — honest data helps your care team help you.
              </p>
              <div className={styles.card}>
                <p className={styles.cardLabel}>Rate each symptom today (0 = none, 5 = severe)</p>
                <div className={styles.symptomGrid}>
                  {SYMPTOMS.map((s) => (
                    <div key={s} className={styles.symptomRow}>
                      <span className={styles.symptomName}>{s}</span>
                      <div className={styles.symptomDots}>
                        {[0, 1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            className={`${styles.symptomDot} ${(symptomLog[s] ?? -1) === v ? styles.symptomDotActive : ''}`}
                            onClick={() => setSymptom(s, v)}
                            aria-label={`${s} severity ${v}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className={styles.primaryBtn} onClick={() => addStar()}>
                  Save today's log ⭐
                </button>
              </div>
            </div>
          )}

          {/* ── PROGRESS ── */}
          {activeSection === 'progress' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                Every check-in, breath, and reflection lights a new star. Watch your sky grow.
              </p>
              <div className={styles.card}>
                <ConstellationJourney totalStars={totalStars} unlocked={unlocked} />
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <span className={styles.statNum}>{totalStars}</span>
                  <span className={styles.statLabel}>Total Stars</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum}>{unlocked.length}</span>
                  <span className={styles.statLabel}>Constellations</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNum}>{unlockedBottles}</span>
                  <span className={styles.statLabel}>Bottles Opened</span>
                </div>
              </div>
            </div>
          )}

          {/* ── REFLECTION ── */}
          {activeSection === 'reflection' && (
            <div className={styles.section}>
              <p className={styles.sectionDesc}>
                Gentle prompts to help you turn inward. There are no right answers — only yours.
              </p>
              <div className={styles.card}>
                <div className={styles.reflectionDisplay}>
                  <span className={styles.reflectionOrb}>🌙</span>
                  <p className={styles.reflectionText}>{REFLECTIONS[reflectionIndex]}</p>
                </div>
                <textarea
                  className={styles.input}
                  placeholder="Write freely here — this is just for you…"
                  rows={5}
                />
                <button type="button" className={styles.reflectionBtn} onClick={nextReflection}>
                  Next reflection ✦
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}