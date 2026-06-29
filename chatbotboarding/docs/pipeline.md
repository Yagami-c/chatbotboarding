# pipeline.md — Development Pipeline

> L2 · PM · Step 5 — Which card to play first

---

## Current State

The prototype is a fully functional web-based simulation. All flows are wired:
- WeChat login (mocked)
- Onboarding (3 steps)
- Home tab: inline assessment + device flows
- AI assistant: Day 1 → Day 2–6 → Day 7 full phase chain
- FloatBall device remote
- Training + Discover tabs

---

## Next Milestones

### Milestone 1 — Live AI Responses
**Goal:** Replace scripted bot messages with real LLM responses.

| Task | Owner | Depends on |
|------|-------|-----------|
| Integrate Qwen or DeepSeek API | Dev | API key |
| Design system prompt using UserData context | PM + Dev | spec.md |
| Implement streaming token render in AssistantPage | Dev | — |
| Fallback to scripted responses on API error | Dev | — |

**Entry condition:** API key available  
**Exit condition:** Bot responds dynamically on Day 1 flow end-to-end

---

### Milestone 2 — Real WeChat Auth
**Goal:** Capture real user nickname, avatar, and phone number via WeChat APIs.

| Task | Owner | Depends on |
|------|-------|-----------|
| Convert app to WeChat Mini Program (Taro or UniApp) | Dev | — |
| Implement `wx.getUserProfile()` for nickname + avatar | Dev | Mini Program env |
| Implement `<button open-type="getPhoneNumber">` + server decode | Dev + Backend | Server + WeChat AppID |
| Store user session with `wx.setStorageSync` | Dev | — |

**Entry condition:** WeChat AppID + AppSecret registered  
**Exit condition:** Real user profile populates `userData.name` and avatar on login

---

### Milestone 3 — BLE Hardware Control
**Goal:** FloatBall and device flows control a real PAD device via Bluetooth.

| Task | Owner | Depends on |
|------|-------|-----------|
| Research PAD BLE protocol (UUIDs, command format) | Hardware + Dev | Device spec |
| Implement `wx.openBluetoothAdapter` + device scan | Dev | Mini Program env |
| Map FloatBall controls → BLE write commands | Dev | Protocol spec |
| Handle BLE notifications → sync hwState | Dev | — |
| Handle disconnect / reconnect gracefully | Dev | — |

**Entry condition:** PAD BLE protocol documented  
**Exit condition:** Start/pause/stop from FloatBall controls physical device

---

### Milestone 4 — Mini Program Deploy
**Goal:** Ship to WeChat Mini Program platform.

| Task | Owner | Depends on |
|------|-------|-----------|
| Choose framework: Taro (React-based) or UniApp | Tech Lead | — |
| Port components to Mini Program compatible JSX | Dev | — |
| Replace web APIs (window.confirm, localStorage) with wx APIs | Dev | — |
| Submit to WeChat for review | PM | Content compliance |

**Entry condition:** Milestones 2 + 3 complete  
**Exit condition:** App live on WeChat Mini Program platform

---

## Priority Order

```
[Now]     Prototype polish (docs, icon, copy)
[Next]    M1 — Live AI (Qwen / DeepSeek)
[Then]    M2 — Real WeChat Auth
[Then]    M3 — BLE Hardware
[Last]    M4 — Mini Program Deploy
```
