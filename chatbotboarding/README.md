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
