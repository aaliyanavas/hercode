# Between us

A hackathon wellness platform for **patients** and **caregivers** — emotional check-ins, appointment prep, calm tools, and shared constellation journeys.

## Quick start

```bash
npm install
npm run setup-models   # downloads face-api.js weights (~1MB)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing — **Between us** (Moodsic-inspired cosmic theme) |
| `/patient` | Patient dashboard (soft pink) |
| `/caregiver` | Caregiver dashboard (gentle lavender) |

## Features

### Patient
- **Mood check-in** — face-api.js facial emotion detection + daily emotion cards
- **Doctor question builder** — turns concerns into appointment questions
- **Message bottles** — unlock affirmations
- **Calm corner** — 4-7-8 bubble breathing, Spotify calming sounds link, guided reflections
- **Constellation journey** — stars unlock themes (Courage, Rest, Hope, Patience)

### Caregiver
- **How are YOU?** — emotion cards + supportive AI copy
- **Shared appointment prep** — summary from patient notes (synced via localStorage)
- **Communication assistant** — phrasing for hard conversations
- **Burnout detection** — stress pattern tracking
- **Constellation journey** — separate progress from patient

## Tech

- React 18 + Vite + TypeScript
- React Router
- [face-api.js](https://github.com/justadudewhohacks/face-api.js) for expression vectors

## Demo flow

1. Patient: enter *"I'm afraid chemo isn't working"* in Question Builder → generates questions → caregiver can open summary.
2. Patient: complete one bubble breathing cycle → earns a constellation star.
3. Caregiver: select **exhausted** several times → burnout meter rises.
