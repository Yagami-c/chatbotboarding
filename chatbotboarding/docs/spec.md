# spec.md — Technical Specification

> L1 · PM · Step 3 — How to implement

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 (utility-first, no CSS modules) |
| State | React `useState` / `useRef` — no external store |
| Routing | None (screen state machine in `App.tsx`) |
| Deploy | Netlify CLI |

---

## Architecture

### Screen State Machine

All navigation is a single `screen` state in `App.tsx`:

```
"wechat-login" → "onboarding" → "home" | "manual-assessment" | "quick-training"
```

`home` is a shell with a `tab` state (`home | training | assistant | discover | profile`). All sub-flows (assessment, device) are inline components rendered inside the active tab — they do not change `screen`.

### Phase State Machine (AI Assistant)

The `phase` state drives the assistant conversation. It is a linear progression with branches:

```
smart_intro
  └─ smart_confirm_assessment
       ├─ [survey chain] → day1_stiffness → day1_triggers → day1_pain → day1_recommend
       └─ day1_manual_level → day1_recommend
            └─ day1_therapy → day1_optimize
                 └─ [daily loop: daily_feel → daily_recommend → daily_therapy → daily_optimize]
                      └─ [day 7: day7_check → day7_summary → done]
```

### Survey Modal Chain

Structured data collection uses a bottom-sheet `SurveyModal` with a `SurveyStep` state. Steps auto-chain via `setTimeout` in the `onSubmit` handler:

```
new_user → safety → (if safe) → [back to phase chat]
day1_post_use → day1_strength → [back to phase chat]
day7_trigger → (day7_new_trigger?) → day7_pain → day7_feel → day7_skin → [day7_summary phase]
```

### Device Simulation

Device state is managed by `hwState` (HwState) and `deviceState` (DeviceState) in `App.tsx`. A `setInterval` decrements `hwRemaining` every second when `hwState === "running"`. A `useEffect` watches `hwRemaining === 0` to trigger post-use survey.

The FloatBall reads `deviceState` for visual state and delegates controls to handlers in `App.tsx`.

---

## Component Map

```
App.tsx
├── WeChatLogin          screen: wechat-login
├── Onboarding           screen: onboarding
├── [home shell]         screen: home
│   ├── HomePage         tab: home
│   │   ├── AssessmentFlow   (inline, 3 steps)
│   │   └── DeviceFlow       (inline, 3 steps)
│   ├── TrainingPage     tab: training
│   ├── AssistantPage    tab: assistant  (defined inline in App.tsx)
│   ├── DiscoverPage     tab: discover
│   └── ProfilePage      tab: profile
├── FloatBall            always visible in home shell
├── BottomNav            always visible in home shell
├── SurveyModal          portal over home shell (zIndex 800)
└── StopReasonModal      portal over home shell (zIndex 800)
```

---

## Data Model

### UserData (persisted in React state, reset on "重新开始")

| Field | Type | Set by |
|-------|------|--------|
| `name` | string | new_user survey or WeChatLogin |
| `gender` | string | new_user survey |
| `ageRange` | string | new_user survey |
| `duration` | string | new_user survey / assessment |
| `safety` | string[] | safety survey |
| `stiffness` | number\|null | day1_stiffness phase |
| `triggers` | string[] | day1_triggers phase |
| `mainTrigger` | string | day1_triggers phase |
| `painLevel` | number | day1_pain phase |
| `baseLevel` | number | day1_pain formula or manual pick |
| `finalLevel` | number | adjusted after each session |
| `postUseFeel` | string | day1_post_use survey |
| `dailyFeel` | string | daily_feel phase or strength survey |
| `day7Trigger` | string | day7_trigger survey |
| `day7Pain` | number | day7_pain survey |
| `day7Feel` | string | day7_feel survey |

### Level Assignment Logic

- Day 1 (from pain score): `finalLevel = Math.max(1, 3 - Math.floor(painLevel / 2))`
- After post-use: if `skin` → level -1; if `strong` → level -1; if `weak` → level +1
- After daily feel: if `worse` → level -1
- Always clamped: `Math.max(1, Math.min(6, level))`

---

## Key Conventions

- **No CSS files** for components — all styling via Tailwind utility classes inline
- **No prop drilling past 2 levels** — lift state to App.tsx instead
- **No async** — all "API calls" are `setTimeout` simulations
- **zIndex layers**: FloatBall=650, SurveyModal=800, DeviceConfirmOverlay=820
- **Animations**: defined in `globals.css` as `@keyframes` (fadeUp, spin, ballPulse, spinRing, taskPulse, badgeBreathe)
- **Mini Program viewport**: 375×812px, `overflow: hidden`, `border-radius: 20px`
