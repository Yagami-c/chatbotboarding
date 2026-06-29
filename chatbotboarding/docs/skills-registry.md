# skills-registry.md — Available Tools & Capabilities

> L2 · PM · Step 4 — What we can build with

---

## Frontend Skills

| Skill | Status | Notes |
|-------|--------|-------|
| React state machine (screens + phases) | ✅ In use | `App.tsx` |
| Tailwind CSS v4 inline styling | ✅ In use | No CSS modules |
| SVG icon authoring | ✅ In use | FloatBall icons, login logo |
| Draggable UI (pointer events) | ✅ In use | FloatBall drag |
| Bottom-sheet modals | ✅ In use | SurveyModal, StopReasonModal |
| Animated progress bars | ✅ In use | TaskBreakdown, device progress |
| GIF-based exercise guide | ✅ In use | TrainingPage, DiscoverPage |
| Multi-step inline wizard | ✅ In use | AssessmentFlow, DeviceFlow |
| Countdown timer simulation | ✅ In use | `setInterval` in App.tsx |
| Recharts (charts) | 🔧 Installed | Not yet used — available for progress graphs |
| Framer Motion | 🔧 Installed (`motion`) | Not yet used — available for transitions |
| React Hook Form | 🔧 Installed | Not yet used — could replace controlled inputs |
| Embla Carousel | 🔧 Installed | Not yet used — could be used for onboarding slides |

---

## AI / LLM Skills

| Skill | Status | Notes |
|-------|--------|-------|
| Phase-driven scripted conversation | ✅ In use | Deterministic bot responses |
| Qwen API integration | 🔲 Planned | Replace scripted responses with live LLM |
| DeepSeek API integration | 🔲 Planned | Alternative LLM provider |
| Streamed bot responses | 🔲 Planned | Token-by-token rendering via SSE |
| Context-aware recommendations | 🔲 Planned | Pass UserData as LLM system prompt context |

---

## Auth & User Skills

| Skill | Status | Notes |
|-------|--------|-------|
| Mock WeChat profile dialog | ✅ In use | Random mock profile per session |
| Mock phone number dialog | ✅ In use | Masked number display |
| Real WeChat Mini Program OAuth | 🔲 Planned | `wx.getUserProfile()` + `wx.login()` |
| Real phone number retrieval | 🔲 Planned | Requires server-side WeChat API call |
| Session persistence | 🔲 Planned | `wx.setStorageSync` or backend |

---

## Hardware / Device Skills

| Skill | Status | Notes |
|-------|--------|-------|
| Device state simulation | ✅ In use | `setInterval` countdown, state machine |
| FloatBall remote control UI | ✅ In use | Connect / Start / Pause / Stop / Reset |
| BLE (Bluetooth Low Energy) | 🔲 Planned | WeChat `wx.openBluetoothAdapter` + PAD protocol |
| Real-time device feedback | 🔲 Planned | BLE notifications → update hwState |

---

## Deploy & Infrastructure Skills

| Skill | Status | Notes |
|-------|--------|-------|
| Netlify CLI deploy | ✅ In use | `npx netlify-cli deploy --prod` |
| WeChat DevTools build | 🔲 Planned | Requires Taro or UniApp conversion |
| CI/CD via GitHub → Netlify | 🔲 Planned | Currently manual CLI only |
