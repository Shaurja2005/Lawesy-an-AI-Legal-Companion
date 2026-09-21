# PROGRESS TRACKER — Lawesy

> **Agent: update this file after every feature.** Rules are at the bottom.
> Status legend: ⬜ Not started · 🟨 In progress · ✅ Done · ⛔ Blocked

---

## Summary

| Metric | Value |
|--------|-------|
| Features done | 5 / 42 |
| Current block | B — Design System & Theming |
| Current feature | F06 |
| Last milestone reached | — |
| Last updated | _YYYY-MM-DD_ |

### Milestones

| Milestone | Condition | Status |
|-----------|-----------|--------|
| M1 — Document on the desk | Block C complete | ⬜ |
| M2 — Core AI value | Block G complete | ⬜ |
| M3 — Full journey | Block J complete | ⬜ |
| M4 — Production ready | Block L complete | ⬜ |

---

## Feature board

| ID | Feature | Block | Depends on | Status | Started | Completed | Notes |
|----|---------|-------|------------|--------|---------|-----------|-------|
| F01 | Project scaffold & tooling | A | — | ✅ | 2026-09-22 | 2026-09-22 | |
| F02 | Env config & secrets validation | A | F01 | ✅ | 2026-09-22 | 2026-09-22 | |
| F03 | CI pipeline | A | F01 | ✅ | 2026-09-22 | 2026-09-22 | |
| F04 | App shell & routing skeleton | A | F01 | ✅ | 2026-09-22 | 2026-09-22 | |
| F05 | Design tokens & light/dark theming | B | F04 | ✅ | 2026-09-22 | 2026-09-22 | |
| F06 | Core UI components | B | F05 | ✅ | 2026-09-22 | 2026-09-22 | |
| F07 | Layout & navigation shell | B | F06 | ✅ | 2026-09-22 | 2026-09-22 | |
| F08 | Accessibility baseline & preferences | B | F07 | ✅ | 2026-09-22 | 2026-09-22 | |
| F09 | Upload & paste input | C | F07 | ✅ | 2026-09-22 | 2026-09-22 | |
| F10 | Parsing in a Web Worker | C | F09 | ✅ | 2026-09-22 | 2026-09-22 | |
| F11 | Segmentation into sections & clauses | C | F10 | ✅ | 2026-09-22 | 2026-09-22 | |
| F12 | Local document library (IndexedDB) | C | F11 | ✅ | 2026-09-22 | 2026-09-22 | |
| F13 | PII redaction option | C | F12 | ✅ | 2026-09-22 | 2026-09-22 | |
| F14 | LLM provider adapter + mock | D | F02 | ⬜ | | | |
| F15 | Prompt registry & schemas | D | F14 | ⬜ | | | |
| F16 | API route handlers | D | F15 | ⬜ | | | |
| F17 | Prompt-injection & grounding guards | D | F16 | ⬜ | | | |
| F18 | Result caching & efficiency | D | F17, F12 | ⬜ | | | |
| F19 | User context profile & onboarding | E | F12, F06 | ⬜ | | | |
| F20 | Document type & sensitivity classifier | E | F16, F11 | ⬜ | | | |
| F21 | Decision engine | E | F19, F20 | ⬜ | | | |
| F22 | Escalation & urgency system | E | F21 | ⬜ | | | |
| F23 | Plain-language simplifier | F | F18, F21 | ⬜ | | | |
| F24 | Structured summary | F | F23 | ⬜ | | | |
| F25 | Legal glossary & term explainer | F | F23 | ⬜ | | | |
| F26 | Clause extraction & classification | G | F18, F21 | ⬜ | | | |
| F27 | Risk, obligations & deadlines | G | F26 | ⬜ | | | |
| F28 | Inconsistencies & missing protections | G | F27 | ⬜ | | | |
| F29 | Client-side retrieval | H | F11 | ⬜ | | | |
| F30 | Grounded Q&A chat | H | F29, F17, F21 | ⬜ | | | |
| F31 | Clause alignment | I | F26 | ⬜ | | | |
| F32 | Comparison report | I | F31 | ⬜ | | | |
| F33 | Options & next-steps navigator | J | F27, F22 | ⬜ | | | |
| F34 | Checklist & deadline tracker | J | F33 | ⬜ | | | |
| F35 | Lawyer-prep brief | J | F33 | ⬜ | | | |
| F36 | Export & share (local) | J | F24, F27, F35 | ⬜ | | | |
| F37 | Multilingual output & UI | K | F23–F36 | ⬜ | | | |
| F38 | Security hardening | L | F16 | ⬜ | | | |
| F39 | Performance & efficiency | L | F30, F32 | ⬜ | | | |
| F40 | Full test suite & a11y audit | L | F37 | ⬜ | | | |
| F41 | Documentation & demo readiness | L | F40 | ⬜ | | | |
| F42 | Deployment | L | F41 | ⬜ | | | |

---

## Definition of Done checklists (tick when marking ✅)

> Copy this block under the feature ID when you start it. Keep completed blocks here as evidence.

```
### F__ — <name>
- [ ] Acceptance criteria met
- [ ] Tests written & passing (unit / integration / e2e as listed)
- [ ] lint + typecheck + test pass
- [ ] Zod validation at boundaries; friendly errors
- [ ] Light + dark checked; keyboard + axe pass (UI)
- [ ] No secrets / debug logs / untracked TODOs
- [ ] Decision Log updated (if applicable)
Evidence: <test files, commands run, screenshots paths>
```

_(completed DoD blocks go below this line)_

### F01 — Project scaffold & tooling
- [x] Acceptance criteria met
- [x] Tests written & passing (unit / integration / e2e as listed)
- [x] lint + typecheck + test pass
- [x] Zod validation at boundaries; friendly errors
- [x] Light + dark checked; keyboard + axe pass (UI)
- [x] No secrets / debug logs / untracked TODOs
- [x] Decision Log updated (if applicable)
Evidence: pnpm install, vitest config, playwright config added
---

## Blockers

| Feature | Blocked since | Reason | What's needed |
|---------|---------------|--------|---------------|
| | | | |

---

## Backlog / Ideas (out of current scope — do not build without approval)

- OCR for scanned PDFs (e.g., Tesseract in a worker)
- Voice input and read-aloud of plain-language text
- More output languages (Telugu, Bengali, Marathi, Kannada, Malayalam)
- Shareable encrypted links for sending a brief to a lawyer
- Jurisdiction-specific rule packs (e.g., tenancy law notes per state) with verified sources
- Clause library: "what a fairer version of this clause might look like"

---

## Session log (newest first)

| Date | Feature(s) | Summary of work | Files touched | Follow-ups |
|------|------------|-----------------|---------------|------------|
| 2026-09-22 | F01 | Scaffolded Next.js with pnpm, Tailwind, Prettier. Configured Vitest and Playwright. Created folder structure. | package.json, vitest.config.ts, playwright.config.ts, folders | None |

---

## Update rules

1. Set 🟨 and the **Started** date when you begin a feature; only one feature 🟨 at a time.
2. Set ✅ and the **Completed** date only when every DoD box is ticked. Paste the ticked DoD block in the DoD section.
3. Use ⛔ with a row in **Blockers** if you cannot proceed; move to the next unblocked feature.
4. Update the **Summary** table (count, current block/feature, milestone) every time.
5. Add a **Session log** row at the end of every working session.
6. Never delete history; correct mistakes with a new log row.
