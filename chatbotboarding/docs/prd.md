# prd.md — Product Requirements

> L1 · PM · Step 2 — What features to build

---

## Product Vision

**哎哟爱膝之家** is a WeChat Mini Program prototype that acts as an AI-powered knee training companion. It guides users through a 7-day structured program using a PAD (Pneumatic Assist Device), with daily check-ins, personalized intensity recommendations, and progress tracking.

The prototype is built as a 375×812px web app simulating the Mini Program container.

---

## Target User

- Age 40–70, experiencing mild to moderate knee discomfort
- Owns or is evaluating the PAD device
- Moderate smartphone literacy; uses WeChat daily
- Tone expectation: **sporty, warm, youth-friendly** — not clinical

---

## User Journey Overview

```
WeChat Login → Onboarding → Home Tab
                                ↓
                    [Smart Mode ON]          [Smart Mode OFF]
                    Assistant Tab            Home Tab (manual)
                         ↓                        ↓
                    Day 1 Flow             Assessment or Device
                    Day 2–6 Loop
                    Day 7 Review
```

---

## Screen Inventory

| Screen | Description |
|--------|-------------|
| `wechat-login` | Entry. Mock WeChat OAuth: profile dialog → phone dialog → loading |
| `onboarding` | 3-step intro: welcome → smart mode toggle → start choice |
| `home` | Home tab with inline assessment flow and device flow |
| `manual-assessment` | Standalone 3-step assessment (from Onboarding) |
| `quick-training` | Standalone device experience, no AI |
| `home` (tabs) | 5-tab shell: 首页 / 训练 / 小瑞 / 发现 / 我的 |

---

## Feature Requirements

### FR-01 · WeChat Login
- Show app logo (house + heart SVG) and brand name on entry
- Simulate WeChat profile permission dialog (nickname, avatar)
- Simulate phone number permission dialog (masked number)
- Random mock profile per session
- "Skip" option bypasses both dialogs

### FR-02 · Onboarding
- Step 1: Welcome screen with brand mascot
- Step 2: Smart Mode toggle — explains AI-guided vs manual mode
- Step 3 (manual only): Choose between "开始分析" (assessment) or "开启设备" (quick start)

### FR-03 · Home Tab — Assessment Flow
- 3-page inline wizard (no separate screen)
- Page 1: Name, gender, age range
- Page 2: Discomfort duration, safety checklist
- Page 3: Morning stiffness, trigger actions (multi-select), pain level 0–4
- Progress bar at top, back navigation at each step
- Safety warning confirmation if risk factors selected

### FR-04 · Home Tab — Device Flow
- 3-page inline wizard
- Page 1: Level selector (L1–L6) + custom mode (pressure / work / rest / cycles sliders)
- Page 2: Wear instructions (4 steps)
- Page 3: Live device status — countdown timer, progress bar, cycle count, pause/stop controls
- "收起 · 设备继续运行" button collapses to FloatBall while device keeps running

### FR-05 · AI Assistant Tab (小瑞)
- Smart mode toggle in header
- Task breakdown progress bar (5 tasks Day 1, 5 tasks Day 2–6, 3 tasks Day 7)
- Phase-driven conversation: bot messages + inline response options
- Survey Modal for structured data collection (bottom sheet)
- Device confirm overlay before starting hardware
- Text input for freeform messages (always visible at bottom)

### FR-06 · Day 1 Flow
- Greeting → assessment survey chain (new_user → safety → stiffness → triggers → pain)
- Level recommendation card with device params and wear/safety notices
- Device session with live countdown
- Post-use survey chain (post_use → strength) → optimization card
- Level auto-adjusts ±1 based on feedback

### FR-07 · Day 2–6 Daily Flow
- Daily check-in: how does your knee feel today?
- Today's plan card with adjusted level
- Device session
- Today's summary card (今日总结 / 举例 tab switcher)
- Navigate to next day

### FR-08 · Day 7 Review Flow
- Re-assess trigger action (same or changed)
- Re-score pain level 0–4
- 7-day overall feel (改善了 / 差不多 / 变差了)
- Skin comfort check
- Stage summary: before/after pain stars, improvement category, next-stage CTA

### FR-09 · FloatBall Device Remote
- Draggable floating ball, always visible when on home screen
- Color and icon reflect device state (disconnected / idle / running / paused / stopped)
- Tap to open slide-out panel with controls and live progress
- Pulsing animation when running

### FR-10 · Training & Discover Tabs
- Training tab: warmup + strength + cooldown exercises with GIFs
- Discover tab: knowledge cards, 5-dimension system overview, team attribution, disclaimer

---

## Out of Scope (Prototype)

- Real WeChat OAuth / backend API calls
- Actual BLE device communication
- Push notifications
- User account persistence across sessions
- Profile tab functionality
