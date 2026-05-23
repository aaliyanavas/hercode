export const CONSTELLATION_THEMES = [
  { id: 'courage', name: 'Courage', starsNeeded: 3 },
  { id: 'rest', name: 'Rest', starsNeeded: 5 },
  { id: 'hope', name: 'Hope', starsNeeded: 7 },
  { id: 'patience', name: 'Patience', starsNeeded: 10 },
] as const;

export type ConstellationId = (typeof CONSTELLATION_THEMES)[number]['id'];
