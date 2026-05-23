export function buildDoctorQuestions(input: string): string[] {
  const lower = input.toLowerCase();
  const questions: string[] = [];

  if (lower.includes('chemo') || lower.includes('treatment') || lower.includes('working')) {
    questions.push('How do we evaluate treatment effectiveness?');
    questions.push('What signs should I monitor between appointments?');
  }
  if (lower.includes('afraid') || lower.includes('scared') || lower.includes('fear')) {
    questions.push('What are realistic expectations for the next phase of care?');
    questions.push('When should I contact the care team between visits?');
  }
  if (lower.includes('pain') || lower.includes('hurt')) {
    questions.push('What pain management options are available to me?');
    questions.push('How should I track symptoms to share at my next visit?');
  }
  if (lower.includes('side effect')) {
    questions.push('Which side effects are expected versus urgent?');
    questions.push('Are there adjustments we can make to improve quality of life?');
  }

  if (questions.length === 0) {
    questions.push('Can we walk through my main concerns from today?');
    questions.push('What should I focus on before our next appointment?');
    questions.push('Who should I contact if something changes at home?');
  }

  return [...new Set(questions)].slice(0, 4);
}

export function buildCommunicationPhrases(input: string): string[] {
  const lower = input.toLowerCase();
  const phrases: string[] = [];

  if (lower.includes('mother') || lower.includes('mom') || lower.includes('parent')) {
    phrases.push(
      "I've been thinking about you and wanted to check in — how have you been feeling lately?",
      "I care about you, and I'm here to listen whenever you want to talk.",
    );
  }
  if (lower.includes('worried') || lower.includes('worry')) {
    phrases.push(
      "I want you to know I'm here with you, not because something is wrong, but because you matter to me.",
      "It's okay if you don't have all the answers right now. We can figure things out together.",
    );
  }
  if (lower.includes('without sounding')) {
    phrases.push(
      'Try leading with warmth: start with something you appreciate about them.',
      'Use "I" statements: "I feel concerned when…" instead of "You always…"',
      'Offer choice: "Would you like to talk now, or would another time be better?"',
    );
  }

  if (phrases.length === 0) {
    phrases.push(
      'I want to share something gently — can we find a quiet moment to talk?',
      "I'm not trying to fix everything. I just want you to know I'm on your side.",
      'Pause, breathe, and let silence be okay. Sometimes presence matters more than words.',
    );
  }

  return phrases.slice(0, 4);
}

export function summarizeAppointmentConcerns(concerns: string): string {
  const trimmed = concerns.trim();
  if (!trimmed) {
    return 'No concerns recorded yet. After the next visit, patient notes will appear here.';
  }
  const sentences = trimmed
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const bullets = sentences.slice(0, 5).map((s) => `• ${s.charAt(0).toUpperCase()}${s.slice(1)}`);
  return `Appointment summary\n\nKey themes from the patient's notes:\n\n${bullets.join('\n')}\n\nSuggested follow-up: Review these points together and note any new questions for the care team.`;
}
