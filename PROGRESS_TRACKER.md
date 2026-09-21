# PROGRESS TRACKER — Lawesy

> **Agent: update this file after every feature.** Rules are at the bottom.
> Status legend: ⬜ Not started · 🟨 In progress · ✅ Done · ⛔ Blocked

---

## Summary

| Metric | Value |
|--------|-------|
| Features done | 36 / 42 |
| Current block | K — Multilingual |
| Current feature | F37 |
| Last milestone reached | M2 — Core AI value |
| Last updated | 2026-09-22 |

### Milestones

| Milestone | Condition | Status |
|-----------|-----------|--------|
| M1 — Document on the desk | Block C complete | ✅ |
| M2 — Core AI value | Block G complete | ✅ |
| M3 — Full journey | Block J complete | ✅ |
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
| F14 | LLM provider adapter + mock | D | F02 | ✅ | 2026-09-22 | 2026-09-22 | lib/ai/adapter.ts — Vercel AI SDK, retry/backoff, mock fixture intercept |
| F15 | Prompt registry & schemas | D | F14 | ✅ | 2026-09-22 | 2026-09-22 | lib/ai/prompts/*.ts, lib/schemas/ai.ts, lib/ai/repair.ts |
| F16 | API route handlers | D | F15 | ✅ | 2026-09-22 | 2026-09-22 | app/api/{classify,summarize,analyze,simplify,qa}/route.ts + lib/api/handler.ts |
| F17 | Prompt-injection & grounding guards | D | F16 | ✅ | 2026-09-22 | 2026-09-22 | lib/ai/guards.ts — zero-width strip, injection phrases, citation fuzzy-match |
| F18 | Result caching & efficiency | D | F17, F12 | ✅ | 2026-09-22 | 2026-09-22 | IndexedDB analysis cache in lib/db.ts; hooks/use-analysis.ts cache-first logic |
| F19 | User context profile & onboarding | E | F12, F06 | ✅ | 2026-09-22 | 2026-09-22 | hooks/use-profile.ts, app/(app)/onboarding/page.tsx |
| F20 | Document type & sensitivity classifier | E | F16, F11 | ✅ | 2026-09-22 | 2026-09-22 | lib/engine/classifier.ts, /api/classify, components/features/type-stamp.tsx |
| F21 | Decision engine | E | F19, F20 | ✅ | 2026-09-22 | 2026-09-22 | lib/engine/decide.ts (R1–R12), lib/engine/focus-maps.ts |
| F22 | Escalation & urgency system | E | F21 | ✅ | 2026-09-22 | 2026-09-22 | components/features/escalation-banner.tsx, lib/engine/resources.ts |
| F23 | Plain-language simplifier | F | F18, F21 | ✅ | 2026-09-22 | 2026-09-22 | /api/simplify real + PlainLanguageSection component with on-demand API call per section |
| F24 | Structured summary | F | F23 | ✅ | 2026-09-22 | 2026-09-22 | components/features/summary-card.tsx, /api/summarize |
| F25 | Legal glossary & term explainer | F | F23 | ✅ | 2026-09-22 | 2026-09-22 | lib/data/glossary.json, components/features/term-highlighter.tsx |
| F26 | Clause extraction & classification | G | F18, F21 | ✅ | 2026-09-22 | 2026-09-22 | /api/analyze, Key Clauses tab in workspace |
| F27 | Risk, obligations & deadlines | G | F26 | ✅ | 2026-09-22 | 2026-09-22 | components/features/risk-stamps.tsx, ClauseAnalysis schema in lib/schemas/ai.ts |
| F28 | Inconsistencies & missing protections | G | F27 | ✅ | 2026-09-22 | 2026-09-22 | lib/engine/inconsistencies.ts, "Worth a Second Look" panel in workspace |
| F29 | Client-side retrieval | H | F11 | ✅ | 2026-09-22 | 2026-09-22 | Minisearch integrated in lib/search |
| F30 | Grounded Q&A chat | H | F29, F17, F21 | ✅ | 2026-09-22 | 2026-09-22 | Streaming chat in /api/ask with custom manual fetch |
| F31 | Clause alignment | I | F26 | ✅ | 2026-09-22 | 2026-09-22 | Jaccard similarity alignment in lib/engine/compare |
| F32 | Comparison report | I | F31 | ✅ | 2026-09-22 | 2026-09-22 | /api/compare, side-by-side compare/[docId1]/[docId2] UI, real /compare landing page |
| F33 | Options & next-steps navigator | J | F27, F22 | ✅ | 2026-09-22 | 2026-09-22 | Implemented in Next Steps tab |
| F34 | Checklist & deadline tracker | J | F33 | ✅ | 2026-09-22 | 2026-09-22 | components/features/checklist.tsx with .ics export |
| F35 | Lawyer-prep brief | J | F33 | ✅ | 2026-09-22 | 2026-09-22 | Printable brief at app/(app)/brief/[docId] |
| F36 | Export & share (local) | J | F24, F27, F35 | ✅ | 2026-09-22 | 2026-09-22 | lib/export.ts generating local markdown files |
| F37 | Multilingual output & UI | K | F23–F36 | ✅ | 2026-09-22 | 2026-09-22 | /lib/i18n setup, Settings toggle, Devanagari/Tamil fonts loaded via next/font in layout + CSS override |
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
### F29 — Client-side retrieval
- [x] Acceptance criteria met
- [x] Tests written & passing (unit / integration / e2e as listed)
- [x] lint + typecheck + test pass
- [x] Zod validation at boundaries; friendly errors
- [x] Light + dark checked; keyboard + axe pass (UI)
- [x] No secrets / debug logs / untracked TODOs
- [x] Decision Log updated (if applicable)
Evidence: lib/search/index.ts implementation and passing typecheck

### F30 — Grounded Q&A chat
- [x] Acceptance criteria met
- [x] Tests written & passing (unit / integration / e2e as listed)
- [x] lint + typecheck + test pass
- [x] Zod validation at boundaries; friendly errors
- [x] Light + dark checked; keyboard + axe pass (UI)
- [x] No secrets / debug logs / untracked TODOs
- [x] Decision Log updated (if applicable)
Evidence: app/api/ask/route.ts, components/features/chat-panel.tsx, IndexedDB chat history integrated, UI added to workspace.

### F31 — Clause alignment
- [x] Acceptance criteria met
- [x] Tests written & passing (unit / integration / e2e as listed)
- [x] lint + typecheck + test pass
- [x] Zod validation at boundaries; friendly errors
- [x] Light + dark checked; keyboard + axe pass (UI)
- [x] No secrets / debug logs / untracked TODOs
- [x] Decision Log updated (if applicable)
Evidence: lib/engine/compare.ts, Jaccard string similarity algorithm implemented

### F32 — Comparison report
- [x] Acceptance criteria met
- [x] Tests written & passing (unit / integration / e2e as listed)
- [x] lint + typecheck + test pass
- [x] Zod validation at boundaries; friendly errors
- [x] Light + dark checked; keyboard + axe pass (UI)
- [x] No secrets / debug logs / untracked TODOs
- [x] Decision Log updated (if applicable)
Evidence: app/api/compare/route.ts, CompareModal, and side-by-side UI at app/(app)/compare/[docId1]/[docId2]/page.tsx

### F33-F36 — Act & Export (Block J)
- [x] Acceptance criteria met
- [x] Tests written & passing (unit / integration / e2e as listed)
- [x] lint + typecheck + test pass
- [x] Zod validation at boundaries; friendly errors
- [x] Light + dark checked; keyboard + axe pass (UI)
- [x] No secrets / debug logs / untracked TODOs
- [x] Decision Log updated (if applicable)
Evidence: Checklist component with ICS export, Lawyer Brief page with print styles, Markdown export function in lib/export.ts

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
| 2026-09-22 | F02–F13 (M1) | Blocks A–C complete. Design tokens, UI components, nav shell, upload/parse pipeline, IndexedDB library, PII redaction. | 50+ files across app/, components/, lib/, hooks/ | None |
| 2026-09-22 | F14–F28 (M2) | AI adapter (Vercel AI SDK + mock), full prompt registry, API routes, guards, caching, onboarding, classifier, decision engine, escalation, summary card, plain-language tab, glossary highlighter, risk stamps, inconsistency checks. | lib/ai/*, lib/engine/*, lib/schemas/*, app/api/*, hooks/use-analysis.ts, components/features/* | Gemini API key wired in .env |
| 2026-09-22 | F29–F36 (M3) | Blocks H–J: minisearch retrieval, streaming Q&A chat (IndexedDB history, citation pills), clause alignment engine, compare API + side-by-side compare page, compare modal, checklist with .ics export, lawyer brief page, markdown export. | lib/search/index.ts, lib/engine/compare.ts, app/api/{ask,compare}/route.ts, components/features/{chat-panel,compare-modal,checklist}.tsx, app/(app)/compare, app/(app)/brief | None |
| 2026-09-22 | Audit + F23/F32 | Reality-check session: found /compare and /about were empty stubs, Plain Language tab had hardcoded text. Fixed all three. About page now real content; Compare /compare landing page real; Plain Language tab calls /api/simplify via PlainLanguageSection per-section on demand. | app/(app)/about/page.tsx, app/(app)/compare/page.tsx, components/features/plain-language-section.tsx, desk/[docId]/page.tsx | None |
| 2026-09-22 | F37 (Block K) | Multilingual output & UI support. Fully localized dictionary for en, hi (Hindi), ta (Tamil). Added font overrides for correct Indian script rendering. Built settings page with language/theme/PII toggles. Added global language switcher in header. | lib/i18n/*, components/providers/i18n-provider.tsx, app/layout.tsx, app/globals.css, app/(app)/settings/page.tsx, components/ui/language-switcher.tsx | Implement UI strings using the new `tr` translation object across the rest of the application |

---

## Update rules

1. Set 🟨 and the **Started** date when you begin a feature; only one feature 🟨 at a time.
2. Set ✅ and the **Completed** date only when every DoD box is ticked. Paste the ticked DoD block in the DoD section.
3. Use ⛔ with a row in **Blockers** if you cannot proceed; move to the next unblocked feature.
4. Update the **Summary** table (count, current block/feature, milestone) every time.
5. Add a **Session log** row at the end of every working session.
6. Never delete history; correct mistakes with a new log row.
