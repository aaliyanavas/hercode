export const PATIENT_EMOTION_CARDS = [
  'scared',
  'numb',
  'hopeful',
  'overwhelmed',
  'angry',
] as const;

export const CAREGIVER_EMOTION_CARDS = [
  'exhausted',
  'worried',
  'grateful',
  'overwhelmed',
  'numb',
] as const;

export type PatientEmotion = (typeof PATIENT_EMOTION_CARDS)[number];
export type CaregiverEmotion = (typeof CAREGIVER_EMOTION_CARDS)[number];

export const PATIENT_AI_RESPONSES: Record<PatientEmotion, string> = {
  scared: "It's okay to feel uncertain before appointments. Your feelings are valid.",
  numb: "Feeling numb is a way your mind protects you. You don't have to force yourself to feel more right now.",
  hopeful: "Hope is a quiet strength. Holding onto even a small spark matters.",
  overwhelmed: "When everything feels like too much, it's alright to pause. One breath at a time.",
  angry: "Anger often sits beside fear or grief. You're allowed to feel it without judging yourself.",
};

export const CAREGIVER_AI_RESPONSES: Record<CaregiverEmotion, string> = {
  exhausted: "Who supports you while you support someone else? Your exhaustion deserves care too.",
  worried: "Worry shows how deeply you care. You don't have to carry every fear alone.",
  grateful: "Noticing small moments of gratitude doesn't erase the hard parts — it honors your humanity.",
  overwhelmed: "You've been holding a lot. It's okay to ask for help before you run empty.",
  numb: "Sometimes caregivers go quiet inside to keep going. That doesn't mean you're failing.",
};

export const FACE_TO_CARD: Record<string, PatientEmotion> = {
  fearful: 'scared',
  sad: 'numb',
  happy: 'hopeful',
  surprised: 'overwhelmed',
  angry: 'angry',
  disgusted: 'overwhelmed',
  neutral: 'numb',
};
