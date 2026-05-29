// import { useNavigate } from 'react-router-dom';
// import styles from './Landing.module.css';

// export default function Landing() {
//   const navigate = useNavigate();

//   return (
//     <div className={styles.page}>
//       <div className={styles.stars} aria-hidden />
//       <div className={styles.content}>
//         <h1 className={styles.brand}>ConstellaCare</h1>
//         <p className={styles.tagline}>A gentle space for Breast Cancer patients and caregivers</p>
//         <p className={styles.description}>
//         ConstellaCare helps you name hard feelings, prepare for appointments & build
//           resilience together — through mood check-ins, calm tools and a shared constellation
//           journey under the same night sky.
//         </p>
//         <div className={styles.actions}>
//           <button
//             type="button"
//             className={`${styles.btn} ${styles.btnPatient}`}
//             onClick={() => navigate('/patient')}
//           >
//             I am a patient
//           </button>
//           <button
//             type="button"
//             className={`${styles.btn} ${styles.btnCaregiver}`}
//             onClick={() => navigate('/caregiver')}
//           >
//             I am a caregiver
//           </button>
//         </div>
//         <p className={styles.sub}>Each path has its own constellation journey.</p>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<null | 'about' | 'resources' | 'ai'>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className={styles.page}>
      <div className={styles.stars} aria-hidden />

      {/* Top nav links */}
      <nav className={styles.nav}>
        <button type="button" className={styles.navLink} onClick={() => setActiveModal('about')}>
          About ConstellaCare
        </button>
        <button type="button" className={styles.navLink} onClick={() => setActiveModal('resources')}>
          Resources &amp; Emergency Support
        </button>
        {/* <button type="button" className={styles.navLink} onClick={() => setActiveModal('ai')}>
          Anonymous AI Support
        </button> */}
      </nav>

      <div className={styles.content}>
        <h1 className={styles.brand}>ConstellaCare</h1>
        <p className={styles.tagline}>A gentle space for Breast Cancer patients and caregivers</p>
        <p className={styles.description}>
          ConstellaCare helps you name hard feelings, prepare for appointments &amp; build
          resilience together — through mood check-ins, calm tools and a shared constellation
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
          {/* <button
            type="button"
            className={`${styles.btn} ${styles.btnAI}`}
            onClick={() => setActiveModal('ai')}
          >
            ✦ Anonymous AI Support
          </button> */}
        </div>
        <p className={styles.sub}>Each path has its own constellation journey.</p>
      </div>

      {/* ── About Modal ── */}
      {activeModal === 'about' && (
        <div className={styles.overlay} onClick={closeModal} role="dialog" aria-modal="true" aria-label="About ConstellaCare">
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>
            <h2 className={styles.modalTitle}>About ConstellaCare</h2>
            <p className={styles.modalText}>
              ConstellaCare was born from a simple belief: no one should have to navigate breast cancer alone — not patients, not the people who love them.
            </p>
            <p className={styles.modalText}>
              We are a digital companion platform designed to sit quietly beside you through diagnosis, treatment, and recovery. Whether you're tracking how you feel today, preparing questions for your next oncologist visit, or simply needing a calm corner of the internet at 3 am — ConstellaCare is here.
            </p>
            <p className={styles.modalText}>
              Our tools are grounded in evidence-based emotional wellness practices and shaped by real stories from patients and caregivers. We believe in the power of shared experience — symbolised by the constellation you build together with your caregiver, two stars travelling the same sky.
            </p>
            <p className={styles.modalText}>
              ConstellaCare does not replace medical advice. We complement your care team by helping you arrive at appointments more prepared, more heard, and more whole.
            </p>
            <div className={styles.modalPill}>🌸 Built with compassion, for the breast cancer community</div>
          </div>
        </div>
      )}

      {/* ── Resources & Emergency Support Modal ── */}
      {activeModal === 'resources' && (
        <div className={styles.overlay} onClick={closeModal} role="dialog" aria-modal="true" aria-label="Resources and Emergency Support">
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>
            <h2 className={styles.modalTitle}>Resources &amp; Emergency Support</h2>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🎗️ Breast Cancer Foundation (BCF)</h3>
              <p className={styles.resourceDesc}>Singapore's leading charity dedicated to breast cancer awareness, early detection and support.</p>
              <a href="https://www.bcf.org.sg" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>bcf.org.sg →</a>
              <a href="tel:+6564767522" className={styles.resourceLink}>📞 +65 6476 7522</a>
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🚨 Emergency &amp; Crisis Lines</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Singapore Emergency</span>
                <a href="tel:995" className={styles.resourceLink}>📞 995</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Samaritans of Singapore (SOS) — 24 hr</span>
                <a href="tel:1767" className={styles.resourceLink}>📞 1767</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>IMH Mental Health Helpline — 24 hr</span>
                <a href="tel:63892222" className={styles.resourceLink}>📞 6389 2222</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>AWARE Women's Helpline</span>
                <a href="tel:1800777555" className={styles.resourceLink}>📞 1800 777 5555</a>
              </div>
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceHeading}>🌐 Helpful Websites</h3>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Breast Cancer Welfare Association</span>
                <a href="https://www.bcwa.org.sg" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>bcwa.org.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Cancer.org — Breast Cancer Guide</span>
                <a href="https://www.cancer.org/cancer/breast-cancer.html" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>cancer.org →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Breastcancer.org — Community &amp; Info</span>
                <a href="https://www.breastcancer.org" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>breastcancer.org →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Singapore Cancer Society</span>
                <a href="https://www.singaporecancersociety.org.sg" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>singaporecancersociety.org.sg →</a>
              </div>
              <div className={styles.resourceRow}>
                <span className={styles.resourceName}>Caregiver Alliance — Support &amp; Resources</span>
                <a href="https://www.caregiversalliance.org.sg" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>caregiversalliance.org.sg →</a>
              </div>
            </div>

            <div className={styles.modalPill}>💜 You are not alone — help is always within reach</div>
          </div>
        </div>
      )}

      {/* ── Anonymous AI Support Modal ── */}
      {/* {activeModal === 'ai' && (
        <div className={styles.overlay} onClick={closeModal} role="dialog" aria-modal="true" aria-label="Anonymous AI Support">
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>
            <h2 className={styles.modalTitle}>✦ Anonymous AI Support</h2>
            <p className={styles.modalText}>
              Sometimes you need a space to speak freely — without logging in, without anyone knowing, without judgment.
            </p>
            <p className={styles.modalText}>
              Our Anonymous AI Support lets you have a gentle, private conversation with an AI companion. Nothing is saved. Nothing is linked to an account. You can share how you're feeling, ask questions about what you're going through, or simply think out loud.
            </p>
            <ul className={styles.modalList}>
              <li>🔒 Fully anonymous — no account required</li>
              <li>💬 A caring, non-clinical conversational space</li>
              <li>🧠 Grounded in emotional wellness principles</li>
              <li>🚫 Not a substitute for medical or crisis support</li>
            </ul>
            <p className={styles.modalTextSmall}>
              If you are in crisis or need immediate help, please reach out to a crisis line. See our <button className={styles.inlineLink} onClick={() => setActiveModal('resources')}>Resources &amp; Emergency Support</button> page.
            </p>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnAI} ${styles.modalCTA}`}
              onClick={() => { closeModal(); navigate('/ai-support'); }}
            >
              Enter Anonymous Support ✦
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}