# rules.md — How AI Should Work

> L0 · Human · Step 1 (parallel with README)

---

## Purpose

This file governs how AI agents (Claude, Copilot, etc.) should behave when contributing to this project. It is read before any code generation, spec writing, or refactoring task.

---

## Core Principles

1. **Read before writing.** Always read the relevant file before editing it. Never guess at existing state.
2. **Match the project's style.** This codebase uses inline Tailwind, React state machines, and no routing library. Don't introduce new patterns unless the PRD requires it.
3. **No over-engineering.** A bug fix does not need a refactor. A new screen does not need a new abstraction layer. Three similar lines is better than a premature abstraction.
4. **No comments explaining what the code does.** Only add a comment when the *why* is non-obvious (a hidden constraint, a workaround, a subtle invariant).
5. **Ship in small, verifiable steps.** After each change, run `npm run build`. If it fails, fix it before moving on.
6. **One source of truth.** Types live in `types.ts`. Screen flow lives in `App.tsx`. Don't duplicate constants.

---

## File Ownership

| File | Who edits it |
|------|-------------|
| `docs/rules.md` | Humans only |
| `docs/prd.md` | PM / Human |
| `docs/spec.md` | PM / Human with AI assist |
| `src/app/types.ts` | AI, but only when a new type is required by the spec |
| `src/app/App.tsx` | AI — screen state machine and survey flows |
| `src/app/components/*` | AI — UI components |

---

## What AI Must Not Do

- Push directly to `main` without a commit message that explains *why*, not just *what*.
- Delete files without confirming with the human first.
- Add dependencies without checking `package.json` first.
- Introduce routing (react-router is installed but intentionally unused).
- Add error boundaries, loading spinners, or retry logic for screens that can't fail in prototype mode.
- Replace emoji icons with image assets unless explicitly asked.

---

## Workflow

1. Human writes or updates `prd.md` with the feature request.
2. AI reads `prd.md` + relevant source files.
3. AI proposes a plan (files to touch, approach) — human approves.
4. AI implements, runs `npm run build`, confirms no errors.
5. AI commits with a descriptive message and pushes.
6. Human reviews in browser at `http://localhost:5173`.
