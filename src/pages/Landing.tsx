import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.stars} aria-hidden />
      <div className={styles.content}>
        <h1 className={styles.brand}>Between us</h1>
        <p className={styles.tagline}>A gentle space for patients and caregivers</p>
        <p className={styles.description}>
          Between us helps you name hard feelings, prepare for appointments, and build
          resilience together — through mood check-ins, calm tools, and a shared constellation
          journey under the same night sky.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPatient}`}
            onClick={() => navigate('/patient')}
          >
            I am a patient
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCaregiver}`}
            onClick={() => navigate('/caregiver')}
          >
            I am a caregiver
          </button>
        </div>
        <p className={styles.sub}>Each path has its own constellation journey.</p>
      </div>
    </div>
  );
}
