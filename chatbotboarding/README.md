# Chatbot Onboarding

AI-powered knee training companion mini-program prototype — built with React + Vite + Tailwind CSS.

Original Figma design: https://www.figma.com/design/jy5V3J2lKUDn8voUVJSdaO/Chatbot--onboarding

## Getting Started

```bash
npm i          # install dependencies
npm run dev    # start dev server at http://localhost:5173
npm run build  # production build → dist/
```

## Project Structure

```
project-root/
├── README.md                  # L0 · Human   · What this project is
├── docs/
│   ├── rules.md               # L0 · Human   · How AI should work (parallel to README, step 1)
│   ├── prd.md                 # L1 · PM      · What features to build (step 2)
│   ├── spec.md                # L1 · PM      · How to implement them (step 3)
│   ├── skills-registry.md     # L2 · PM      · Available tools & capabilities (step 4)
│   ├── pipeline.md            # L2 · PM      · Which card to play first (step 5)
│   └── test-plan.md           # L3 · QA      · How to validate (step 6)
└── src/
    └── app/
        ├── App.tsx            # Root — screen state machine + all survey flows
        ├── types.ts           # Shared types, constants, level params
        └── components/
            ├── WeChatLogin    # Mock WeChat auth (profile + phone permission dialogs)
            ├── Onboarding     # 3-step onboarding flow
            ├── HomePage       # Home tab — inline assessment & device flows
            ├── TrainingPage   # Exercise guide with GIFs
            ├── DiscoverPage   # Tips & knowledge cards
            ├── ProfilePage    # Profile (stub)
            └── shared         # FloatBall, BottomNav, UI primitives
```

## Deploy

```bash
npx netlify-cli deploy --build --prod
```

Live: https://super-torrone-146b52.netlify.app

## Roadmap / Requirements

The following are confirmed product requirements for the next stages of development.

### REQ-01 · WeChat Mini Program Deploy
Deploy the app as a native WeChat Mini Program. This requires porting the current React/Vite web app to a Mini Program-compatible framework (Taro or UniApp), replacing all web APIs with `wx.*` equivalents, and submitting for WeChat platform review.

### REQ-02 · 小瑞 AI: Integrate Qwen / DeepSeek API
Replace the current scripted bot responses in the AI assistant tab with live LLM responses. The AI should receive user profile data (`UserData`) as system prompt context and generate personalized guidance. Candidate APIs: Alibaba Qwen (`qwen-turbo` / `qwen-plus`) and DeepSeek (`deepseek-chat`). Streamed token-by-token rendering is preferred.

### REQ-03 · Real WeChat Auth
Upgrade the mock WeChat login to a real OAuth flow. On login, the app should capture:
- Nickname and avatar via `wx.getUserProfile()`
- Phone number via `<button open-type="getPhoneNumber">` + server-side decryption using WeChat AppSecret

Requires a registered WeChat Mini Program (AppID + AppSecret) and a backend service to handle the decryption call.

### REQ-04 · BLE Hardware Control (PAD Device)
Enable the FloatBall remote and device flow to control the physical PAD device over Bluetooth. Implementation via WeChat's `wx.openBluetoothAdapter` API. The app should:
- Scan for and connect to the PAD device
- Map start / pause / stop / level-change controls to BLE write commands
- Receive BLE notifications from the device to sync countdown and cycle state in the UI
