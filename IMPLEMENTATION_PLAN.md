# IMPLEMENTATION PLAN — Lawesy

> Build **block by block, feature by feature, in ID order** unless dependencies allow otherwise.
> Each feature lists: **Goal · Depends on · Tasks · Acceptance criteria · Tests**.
> After finishing a feature, update `docs/PROGRESS_TRACKER.md` (see `AGENTS.md` §3).
> Data models, API contracts, and rules referenced here are defined in `docs/SOURCE_OF_TRUTH.md` (SOT).

---

## Block overview

| Block | Name | Features | Outcome |
|-------|------|----------|---------|
| A | Foundation | F01–F04 | Running, linted, tested, CI'd skeleton |
| B | Design System & Theming | F05–F08 | Wood & paper UI kit, light/dark, accessible shell |
| C | Document Intake | F09–F13 | Upload/paste → parsed, segmented, stored locally |
| D | AI Core | F14–F18 | Safe, validated, provider-agnostic LLM layer |
| E | Context & Decision Engine | F19–F22 | Profile-driven, explainable adaptive behavior |
| F | Understand | F23–F25 | Plain language, summary, glossary |
| G | Examine | F26–F28 | Clauses, risks, obligations, inconsistencies |
| H | Ask | F29–F30 | Grounded Q&A with citations |
| I | Compare | F31–F32 | Two-document comparison |
| J | Act | F33–F36 | Next steps, checklist & deadlines, lawyer brief, export |
| K | Language | F37 | Multilingual output & UI |
| L | Hardening & Release | F38–F42 | Security, performance, full test suite, docs, deploy |

**Milestones**
- **M1 (end of Block C):** a user can drop a document on the desk and see it rendered as paper with clause IDs.
- **M2 (end of Block G):** core AI value — summary, plain language, clause risk analysis — adapted to profile.
- **M3 (end of Block J):** full journey from document to action.
- **M4 (end of Block L):** production-ready, deployed.

---

# Block A — Foundation

### F01 · Project scaffold & tooling
**Goal:** Clean, strict, consistent codebase from commit one.
**Depends on:** —
**Tasks**
- Create Next.js (App Router) + TypeScript strict project with pnpm; enable `noUncheckedIndexedAccess`.
- Install and configure Tailwind, ESLint (Next, typescript-eslint strict, `jsx-a11y`, import ordering), Prettier.
- Set up Vitest + Testing Library (jsdom) and Playwright + `@axe-core/playwright`.
- Create folder structure from SOT §5.3 with placeholder `index.ts` files where helpful.
- Add npm scripts from `AGENTS.md` §7. Add `.editorconfig`, `.nvmrc`, `.gitignore`.
**Acceptance criteria**
- `pnpm dev` shows a placeholder page; `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass.
- One sample unit test and one sample Playwright test run green.
**Tests:** sample unit test; sample e2e smoke test.

### F02 · Environment config & secrets validation
**Goal:** Fail fast on bad config; never leak secrets.
**Depends on:** F01
**Tasks**
- `/lib/env.ts`: Zod schema for SOT §10 vars; separate `serverEnv` (import guarded with `server-only`) and `publicEnv`.
- Provider-specific requirement (key required only for the selected provider).
- `.env.example` with all keys, no values.
**Acceptance criteria**
- Missing/invalid env produces a clear startup error naming the variable (not its value).
- Importing `serverEnv` from a client component fails the build.
**Tests:** unit tests for valid, missing-key, wrong-provider, and mock configurations.

### F03 · CI pipeline
**Goal:** Every push is verified.
**Depends on:** F01
**Tasks**
- GitHub Actions workflow: install (cached pnpm) → lint → typecheck → unit tests with coverage → build → Playwright (with `LLM_PROVIDER=mock`).
- Upload coverage and Playwright report as artifacts. Add Dependabot (or Renovate) config.
**Acceptance criteria:** workflow passes on a clean branch; failing test fails the job.
**Tests:** the pipeline itself.

### F04 · App shell & routing skeleton
**Goal:** All routes exist with correct semantics.
**Depends on:** F01
**Tasks**
- Create routes from SOT §5.3 with placeholder content, `metadata` titles, `not-found.tsx`, `error.tsx`, `loading.tsx`.
- Root layout: `<html lang>`, skip-to-content link, `<header>/<nav>/<main>/<footer>` landmarks.
**Acceptance criteria:** every route renders; skip link works; each page has a unique title and one `<h1>`.
**Tests:** e2e navigation smoke across all routes; axe on each route.

---

# Block B — Design System & Theming

> Before starting: read `docs/DESIGN_SYSTEM.md` fully and all installed UI skills (taste, impeccable, others). Apply them throughout Block B and every later UI task.

### F05 · Design tokens & light/dark theming
**Goal:** Wood & paper identity implemented as tokens, in two themes.
**Depends on:** F04
**Tasks**
- Implement CSS custom properties from `DESIGN_SYSTEM.md` §3 for `:root` (Day Desk) and `.dark` (Lamplit Study); map into Tailwind theme.
- Add `next-themes` with system default, manual toggle (Day / Lamplit / System), no flash on load.
- Implement lightweight texture layer: CSS/SVG-noise wood grain for desk surface and paper fiber for sheets (inline SVG data URI or CSS gradients; no large images).
- Load fonts via `next/font` (self-hosted), with fallbacks.
**Acceptance criteria**
- Toggle switches theme instantly, persists, respects system preference; no hydration flash.
- All text/background token pairs meet WCAG AA contrast in both themes (document the ratios in a table in `DESIGN_SYSTEM.md` §3.4).
- Texture assets total < 30 KB.
**Tests:** unit test for contrast helper against token pairs; e2e toggle test; visual check screenshots for both themes.

### F06 · Core UI components
**Goal:** Reusable, accessible building blocks.
**Depends on:** F05
**Tasks** — build in `/components/ui` (Radix where applicable), each with typed props and both themes:
- `Paper` (sheet with edge/shadow variants: flat, stacked, pinned), `DeskSurface`, `Button` (primary "ink", secondary, ghost, danger "seal"), `IconButton`, `Tag`/`Stamp` (risk levels with icon + text), `FolderTabs` (Radix Tabs styled as file-folder dividers), `IndexCard`, `StickyNote` (tips), `WaxSeal` (verdict badge), `Dialog`, `Drawer`, `Tooltip`, `Popover`, `Toast`, `Input`, `Textarea`, `Select`, `Switch`, `Skeleton` (paper-shimmer), `EmptyState`, `ErrorState`, `Disclaimer`.
**Acceptance criteria**
- All interactive components keyboard-operable with visible focus rings; correct ARIA via Radix.
- Risk tags never rely on color alone (icon + label).
- Components render correctly in both themes; motion respects `prefers-reduced-motion`.
**Tests:** unit tests per component (render, keyboard, ARIA); a `/dev/components` gallery page (excluded from production) with axe e2e scan.

### F07 · Layout & navigation shell
**Goal:** The "desk" workspace layout.
**Depends on:** F06
**Tasks**
- Header (logo wordmark, nav, theme toggle, settings), footer with disclaimer.
- Workspace layout: left **drawer** (document library), center **paper stack** (document/content), right **margin** (tools, suggested actions); collapses to single column with bottom tab bar on mobile.
- Landing page ("the desk"): value proposition, "Place a document on the desk" CTA, privacy promise, how-it-works in three index cards.
**Acceptance criteria:** responsive from 360px to 1440px+; no horizontal scroll; landmarks and headings correct.
**Tests:** e2e at mobile/tablet/desktop viewports; axe scan.

### F08 · Accessibility baseline & preferences
**Goal:** Inclusive by default.
**Depends on:** F07
**Tasks**
- Settings: text size (100/115/130%), reduced motion override, high-contrast toggle (reduces texture, strengthens borders), dyslexia-friendly spacing option.
- Live region utility for async status ("Analyzing clauses…", "Answer ready").
- Focus management helper for route changes and dialogs.
**Acceptance criteria:** preferences persist; high-contrast mode passes AAA contrast for body text; screen reader announces async states.
**Tests:** unit tests for preference store; e2e for keyboard-only journey through landing → settings.

---

# Block C — Document Intake

### F09 · Upload & paste input
**Goal:** Easy, safe document entry.
**Depends on:** F07
**Tasks**
- "Place on desk" dropzone (drag-drop + keyboard-accessible file button) accepting `.pdf`, `.docx`, `.txt`; paste-text dialog with title field.
- Client-side validation: extension + MIME + magic bytes; size ≤ 10 MB; friendly errors.
- Load 3 sample documents from `/tests/fixtures` as "Try a sample" (lease, employment offer, terms of service) — synthetic, not real people.
**Acceptance criteria:** invalid files rejected with clear message; screen-reader-accessible dropzone; samples load in one click.
**Tests:** unit tests for validators (including renamed-extension spoof); e2e upload of each type.

### F10 · Parsing in a Web Worker
**Goal:** Extract clean text without blocking the UI.
**Depends on:** F09
**Tasks**
- `workers/parse.worker.ts`: pdfjs-dist text extraction (page-aware), mammoth for DOCX (raw text), TXT decode (UTF-8 with fallback).
- Normalize: unify whitespace, fix hyphenated line breaks, remove repeated headers/footers and page numbers.
- Progress events; cancel support; timeout.
- Detect likely scanned PDF (R11) and return a quality flag.
**Acceptance criteria:** 30-page PDF parses without UI jank; progress shown; scanned-PDF flag triggers helpful message.
**Tests:** unit tests on normalizer with fixture text; integration test for each file type fixture.

### F11 · Segmentation into sections & clauses
**Goal:** Stable IDs for citation and navigation.
**Depends on:** F10
**Tasks**
- `/lib/documents/segment.ts`: detect headings (numbered "1.", "1.1", "Article", "Section", ALL CAPS lines, roman numerals), split into `Section` and `ClauseRef` with character offsets; fallback to paragraph-based segmentation.
- Deterministic IDs `S{n}` / `S{n}.{m}`; `contentHash` via Web Crypto SHA-256.
- Document viewer: paper rendering with clause IDs in the margin, anchor links (`#S3.2`), highlight-on-navigate.
**Acceptance criteria:** same input always yields the same IDs; offsets map back to exact text; viewer can scroll-to-clause.
**Tests:** unit tests with multiple heading styles and unstructured text; property test: concatenated clauses reconstruct normalized text.

### F12 · Local document library (IndexedDB)
**Goal:** Documents persist privately in the browser.
**Depends on:** F11
**Tasks**
- Dexie schema: `documents`, `analyses` (cache), `profile`, `checklists`, `chats`; versioned migrations.
- Repositories with Zod-validated reads.
- Library drawer: list as paper stack (title, type stamp, date), rename, delete (with confirm), "Clear all my data" in settings.
**Acceptance criteria:** data survives reload; delete removes document and all related records; clear-all empties DB.
**Tests:** repository unit tests with `fake-indexeddb`; e2e add → reload → delete.

### F13 · PII redaction option
**Goal:** Let users hide personal data before anything leaves the browser.
**Depends on:** F12
**Tasks**
- `/lib/documents/redact.ts`: regex-based detection for emails, phone numbers, Aadhaar-like 12-digit IDs, PAN format, card numbers (Luhn), bank account/IFSC patterns, and user-supplied names.
- Toggle in profile/settings; preview of redactions; redacted placeholders like `[PHONE_1]` consistently mapped so answers stay coherent; un-redact locally for display.
**Acceptance criteria:** when enabled, request payloads contain no detected PII (verified in tests); display still shows original text locally.
**Tests:** unit tests per pattern (true/false positives); integration test inspecting outgoing API payload via MSW.

---

# Block D — AI Core

### F14 · LLM provider adapter + mock provider
**Goal:** One interface, many providers, deterministic tests.
**Depends on:** F02
**Tasks**
- `/lib/ai/adapter.ts`: `generateStructured<T>(task, schema, input)` and `streamText(task, input)` built on the Vercel AI SDK; provider selected from env.
- Providers: Gemini (default), Anthropic, OpenAI, and `mock` (returns fixture JSON per task from `/tests/fixtures/llm/`).
- Timeouts, abort signals, retry with backoff on 429/5xx (max 2), token usage logging (counts only, never content).
**Acceptance criteria:** switching `LLM_PROVIDER` requires no code change; mock provider fully covers all tasks.
**Tests:** unit tests for provider selection, retry logic, timeout, mock responses.

### F15 · Prompt registry & structured schemas
**Goal:** Versioned, reviewable prompts with typed outputs.
**Depends on:** F14
**Tasks**
- `/lib/schemas/*`: Zod schemas for every model in SOT §6.
- `/lib/ai/prompts/<task>.v1.ts`: builder functions `(input) => { system, user }` following SOT §9 principles; document text wrapped in delimiters.
- `/lib/ai/repair.ts`: on schema failure, one repair call with the validation error; then typed error.
**Acceptance criteria:** every task has a prompt + schema + fixture; prompts include grounding, untrusted-content, language, and reading-level instructions.
**Tests:** snapshot tests of built prompts; schema tests with valid/invalid fixtures; repair path test.

### F16 · API route handlers
**Goal:** Secure, consistent HTTP layer.
**Depends on:** F15
**Tasks**
- Shared `withApiHandler` wrapper: method check, body size limit, Zod parse, rate limit, error mapping to SOT §8 format, request ID.
- Implement route stubs for all SOT §8 endpoints wired to adapter (content filled in by later features).
- Rate limiter: in-memory token bucket per IP (optional Upstash if env present).
- Typed client `/lib/api/client.ts` validating responses.
**Acceptance criteria:** invalid input → 400 with safe message; oversized → 413; over limit → 429 with `Retry-After`; no stack traces in responses.
**Tests:** integration tests per route with mock provider (happy path, invalid, oversized, rate-limited).

### F17 · Prompt-injection & grounding guards
**Goal:** The model analyzes documents; documents never control the model.
**Depends on:** F16
**Tasks**
- `/lib/ai/guards.ts`: strip control/zero-width characters; detect injection phrases ("ignore previous instructions", role-play directives, fake system tags) and flag them; enforce delimiters.
- Citation verifier: every `Citation.quote` must fuzzy-match (normalized) text inside its `clauseId`; invalid citations removed and answer confidence downgraded.
- UI notice when a document contained suspicious instructions ("This document contains text that looks like instructions to an AI. We ignored it.").
**Acceptance criteria:** injection fixtures do not change output behavior with mock + (manually) real provider; fabricated citations never reach the UI.
**Tests:** unit tests for sanitizer, detector, verifier; integration test with injected fixture document.

### F18 · Result caching & request efficiency
**Goal:** Pay for each analysis once.
**Depends on:** F17, F12
**Tasks**
- Client cache in Dexie `analyses` keyed per SOT §11; invalidated on prompt version or profile change.
- In-flight request de-duplication; AbortController on navigation away.
- Map-reduce helper for long documents (section batches → merge step).
**Acceptance criteria:** reopening a document shows cached results instantly with no network call; long fixture (>60k chars) completes via map-reduce.
**Tests:** unit tests for cache keys/invalidation; integration test asserting single network call for repeated requests.

---

# Block E — Context & Decision Engine

### F19 · User context profile & onboarding
**Goal:** Know who the user is, in under a minute.
**Depends on:** F12, F06
**Tasks**
- Onboarding as a short "intake form on paper" (3–4 steps): role, jurisdiction (country + optional state/region), goal, expertise, output language, PII redaction preference. Skippable with sensible defaults.
- Profile editable anytime from the workspace margin ("You're viewing as: Tenant · Tamil Nadu, IN · New to this").
**Acceptance criteria:** profile persisted and validated; changing it re-runs the decision engine and marks cached analyses stale.
**Tests:** unit tests for profile store; e2e onboarding (complete + skip) keyboard-only.

### F20 · Document type & sensitivity classifier
**Goal:** Know what the document is.
**Depends on:** F16, F11
**Tasks**
- `/api/classify` implementation: docType, confidence, sensitive signals (SOT R5 domains), language.
- Local keyword pre-classifier (fast heuristics) used as a hint and fallback when the API fails.
- Show a type stamp on the paper ("LEASE AGREEMENT"), user can correct it.
**Acceptance criteria:** correct type for all fixtures (mock); user correction overrides and persists.
**Tests:** unit tests for heuristic classifier; integration test for route.

### F21 · Decision engine
**Goal:** Logical, explainable, context-driven behavior.
**Depends on:** F19, F20
**Tasks**
- `/lib/engine/decide.ts` implementing `EngineDecision` and rules R1–R12 (SOT §7) as small pure functions composed in order; `focus-maps.ts` for role × docType.
- "Why am I seeing this?" popover listing which rules fired, in plain language.
- Suggested action chips in the right margin driven by `suggestedActions` (e.g., "See risky clauses", "Compare with your other lease", "Prepare lawyer brief").
**Acceptance criteria:** every rule has at least one positive and one negative test; decision is recomputed on profile/doc/findings change; explanation popover matches fired rules.
**Tests:** table-driven unit tests for each rule and for combinations; component test for chips.

### F22 · Escalation & urgency system
**Goal:** Know when to say "see a lawyer" — and say it well.
**Depends on:** F21
**Tasks**
- Escalation banner component with three levels (urgent / recommended / optional), accessible (`role="alert"` only for urgent).
- Deadline proximity calculation (R4) from extracted deadlines.
- Jurisdiction resources panel (`resources.ts`), e.g. legal aid authorities; verified links only.
- Info-only mode for sensitive domains: disables "negotiation" style suggestions, emphasizes professional help.
**Acceptance criteria:** notice fixture triggers urgent escalation with resources; banner never dismissible for urgent without acknowledgment.
**Tests:** unit tests for escalation computation; e2e with legal-notice fixture.

---

# Block F — Understand

### F23 · Plain-language simplifier
**Goal:** Make every section readable.
**Depends on:** F18, F21
**Tasks**
- `/api/simplify` with reading level from decision (user override: Simple / Standard / Detailed).
- "Plain" tab: side-by-side original ↔ plain (stacked on mobile), synced scrolling by section, lazy simplification section-by-section as the user scrolls.
- Jargon terms returned in `termsUsed` become glossary-linked.
**Acceptance criteria:** changing reading level updates output (cached per level); every plain section links back to its original section.
**Tests:** integration test for route; component test for side-by-side sync; e2e reading-level switch.

### F24 · Structured summary
**Goal:** The document on one index card.
**Depends on:** F23
**Tasks**
- `/api/summarize` → `Summary`; displayed as a pinned index card at the top of the workspace: one-liner, parties, term, money, key points (each with clause citation chips).
- Emphasis ordering follows `focusCategories`.
**Acceptance criteria:** each key point has ≥ 1 valid citation; clicking a citation scrolls to and highlights the clause.
**Tests:** integration + component tests; e2e citation navigation.

### F25 · Legal glossary & term explainer
**Goal:** No unexplained jargon.
**Depends on:** F23
**Tasks**
- Curated local glossary JSON (~80 common terms: indemnity, force majeure, arbitration, lien, severability, etc.) with plain definitions and examples.
- Inline term highlighting in document and outputs (auto-on for `new` expertise); popover/index-card explanation; fallback `/api/explain-term` for unknown terms.
- Glossary page/drawer with search.
**Acceptance criteria:** popovers keyboard- and screen-reader-accessible; local terms need no network.
**Tests:** unit tests for term matcher (word boundaries, case); component test for popover a11y.

---

# Block G — Examine

### F26 · Clause extraction & classification
**Goal:** Every clause categorized and explained.
**Depends on:** F18, F21
**Tasks**
- `/api/analyze` (part 1): per-clause category, title, plain summary, citations; batching per section for long docs.
- "Clauses" tab: file-folder style list grouped by category, ordered by `focusCategories`; filter by category/risk; search.
**Acceptance criteria:** every clause analysis references a valid `clauseId`; grouping and filters work; results cached.
**Tests:** integration test with fixtures; component tests for filters.

### F27 · Risk, obligations & deadlines
**Goal:** Highlight what matters to *this* user.
**Depends on:** F26
**Tasks**
- Extend analysis with `risk`, `riskReason`, `favorsParty`, `obligations`, `deadlines`, `overallRisk`.
- Risk stamps (High / Medium / Low / Info with icon + label), wax-seal overall verdict, "Your obligations" and "Their obligations" lists, deadlines timeline.
- Risk heat strip in the document margin to jump to risky clauses.
**Acceptance criteria:** risk is relative to the user's role (a clause favoring the landlord is higher risk for a tenant); obligations split by party; deadlines feed F22 and F34.
**Tests:** fixture-based integration tests (role changes risk ordering); component tests.

### F28 · Inconsistencies & missing protections
**Goal:** Spot what's contradictory or absent.
**Depends on:** F27
**Tasks**
- Extend analysis: `inconsistencies` (e.g., notice period 30 days in S4, 60 days in S9) and `missingProtections` based on docType checklist (e.g., lease without deposit-return timeline).
- Deterministic pre-checks where possible (conflicting numbers/durations for same term) merged with LLM findings.
- Displayed as sticky notes on the relevant clauses and in a "Worth a second look" section.
**Acceptance criteria:** seeded inconsistency fixture detected; missing-protection checklist per docType lives in data, not prompts.
**Tests:** unit tests for deterministic checks; integration test with fixture.

---

# Block H — Ask

### F29 · Client-side retrieval
**Goal:** Send the model only what it needs.
**Depends on:** F11
**Tasks**
- `/lib/search`: MiniSearch index per document over clauses (fields: text, heading, category), built on open and cached; query expansion with glossary synonyms.
- `retrieve(question, k=6)` returns clause chunks with IDs.
**Acceptance criteria:** relevant clause in top-6 for a set of ≥ 15 fixture question/answer pairs (≥ 85% hit rate).
**Tests:** retrieval evaluation test over fixture Q&A pairs.

### F30 · Grounded Q&A chat
**Goal:** Ask anything about the document; get cited answers.
**Depends on:** F29, F17, F21
**Tasks**
- "Ask" tab: chat on lined paper; streaming answers; citation chips; "Not in this document" state; follow-up suggestions; starter questions tailored by role × docType.
- History persisted per document (Dexie), clearable.
- Low-confidence answers trigger R12 suggestion.
**Acceptance criteria:** answers cite valid clauses; out-of-scope questions return `foundInDocument=false` without invented content; streaming accessible (final answer announced once, not every token).
**Tests:** integration test for `/api/ask` (in-scope, out-of-scope, injection attempt in question); e2e chat flow.

---

# Block I — Compare

### F31 · Clause alignment
**Goal:** Match up equivalent clauses across two documents.
**Depends on:** F26
**Tasks**
- Select two documents from the library (or upload a second).
- Deterministic first pass: align by category + text similarity (token Jaccard / TF-IDF cosine); LLM pass for unmatched/ambiguous pairs.
**Acceptance criteria:** known-version fixture pair (v1 vs v2 lease) aligns correctly.
**Tests:** unit tests for similarity/alignment; integration test.

### F32 · Comparison report
**Goal:** "What changed and who does it favor?"
**Depends on:** F31
**Tasks**
- `/api/compare` → `ComparisonResult`; two sheets side by side with connecting markers; change stamps (Added / Removed / Changed / Same); "Better for you" indicators relative to user role; summary index card.
- Text-level diff highlighting within changed clause pairs.
**Acceptance criteria:** works on mobile (stacked with pair navigation); every change references clause IDs from both docs.
**Tests:** integration + component tests; e2e comparison flow.

---

# Block J — Act

### F33 · Options & next-steps navigator
**Goal:** Turn understanding into a plan.
**Depends on:** F27, F22
**Tasks**
- `/api/next-steps` → `NextStepPlan`, shaped by goal (sign / negotiate / dispute / respond).
- "Next Steps" tab: options as index cards (pros, cons, effort), ordered steps, escalation block; negotiation notes when goal = negotiate.
**Acceptance criteria:** plan changes meaningfully with goal; escalation from engine always shown when present.
**Tests:** integration tests across goals; component test.

### F34 · Checklist & deadline tracker
**Goal:** Practical to-dos with dates.
**Depends on:** F33
**Tasks**
- Checklist generated from obligations, deadlines, and next steps; editable (add/edit/check/delete), persisted.
- Convert relative deadlines to dates with a user-provided anchor date (e.g., "lease start").
- `.ics` export of dated items (RFC 5545 compliant, escaped text).
**Acceptance criteria:** `.ics` imports into common calendar apps; checklist survives reload.
**Tests:** unit tests for `.ics` generator and date resolution; e2e checklist interactions.

### F35 · Lawyer-prep brief
**Goal:** Walk into a consultation prepared.
**Depends on:** F33
**Tasks**
- `/api/brief` → `LawyerBrief` using summary, findings, and optional user notes ("What happened so far?").
- Printable page `/brief/[docId]` styled like a typed memo on letter paper; editable before print.
**Acceptance criteria:** brief includes facts, timeline, cited clauses, questions, documents to bring; print stylesheet produces clean pages in both themes (print always uses light paper).
**Tests:** integration test; e2e print-preview snapshot.

### F36 · Export & share (local)
**Goal:** Take results anywhere.
**Depends on:** F24, F27, F35
**Tasks**
- Export summary, clause findings, checklist, brief as Markdown download; "Print / Save as PDF" via print stylesheet; copy-to-clipboard.
- Exports include the disclaimer and generation date.
**Acceptance criteria:** exports are well-formed and readable; no raw HTML injection possible.
**Tests:** unit tests for markdown exporters (escaping); e2e download.

---

# Block K — Language

### F37 · Multilingual output & UI strings
**Goal:** Legal access in the user's language.
**Depends on:** F23–F36
**Tasks**
- UI strings in `/lib/i18n` (en, hi, ta) with a tiny typed `t()` helper; `lang` attribute updates; fonts support Devanagari and Tamil scripts.
- All generation routes respect `outputLanguage`; quotes stay verbatim.
- Language switch in settings and onboarding.
**Acceptance criteria:** switching language updates UI and new AI outputs; cached outputs keyed by language; no missing keys (CI check).
**Tests:** unit test for missing translation keys; e2e language switch.

---

# Block L — Hardening & Release

### F38 · Security hardening
**Goal:** Safe and responsible by default.
**Depends on:** F16
**Tasks**
- Security headers via middleware/`next.config`: strict CSP (nonce-based scripts, `connect-src 'self'`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`.
- Sanitize all rendered markdown (`rehype-sanitize`); no `dangerouslySetInnerHTML`.
- Logging policy: no document text, questions, or PII in logs.
- `pnpm audit` in CI; review checklist in `QUALITY_SECURITY_TESTING.md` §3.
**Acceptance criteria:** headers verified by test; XSS fixture renders inert; audit has no high/critical issues.
**Tests:** integration tests for headers; XSS rendering test.

### F39 · Performance & efficiency
**Goal:** Fast on modest devices and networks.
**Depends on:** F30, F32
**Tasks**
- Code-split heavy modules (pdfjs, comparison, brief); lazy-load tabs; memoize expensive renders; virtualize long clause lists.
- Lighthouse run; meet budgets in `QUALITY_SECURITY_TESTING.md` §5.
**Acceptance criteria:** budgets met on landing and workspace; no main-thread task > 200 ms during parsing.
**Tests:** Lighthouse CI (or documented manual run) results committed to `docs/perf-report.md`.

### F40 · Full test suite & accessibility audit
**Goal:** Confidence in every journey.
**Depends on:** F37
**Tasks**
- E2E journeys (mock provider): (1) onboard → upload lease → summary → risky clauses → ask → checklist → .ics; (2) compare two contracts; (3) legal notice → urgent escalation → brief; (4) keyboard-only journey; (5) dark mode journey.
- axe scans on every route in both themes; manual screen-reader checklist (NVDA/VoiceOver) recorded.
- Coverage ≥ 80% lines for `/lib`.
**Acceptance criteria:** all green in CI; a11y checklist completed.
**Tests:** as listed.

### F41 · Documentation & demo readiness
**Goal:** Reviewers understand it in five minutes.
**Depends on:** F40
**Tasks**
- `README.md`: problem, features, screenshots (both themes), architecture diagram, decision engine explanation, security & privacy approach, testing approach, accessibility statement, setup, env vars, scripts, limitations.
- Demo script with sample documents; `CONTRIBUTING.md` short guide.
**Acceptance criteria:** fresh clone → running app in ≤ 5 commands following README.
**Tests:** manual verification noted in tracker.

### F42 · Deployment
**Goal:** Live, stable URL.
**Depends on:** F41
**Tasks**
- Deploy to Vercel or Cloud Run (Dockerfile, non-root user, healthcheck route `/api/health`).
- Production env vars set; rate limiting verified; error monitoring (optional) without PII.
**Acceptance criteria:** production URL works end-to-end with real provider; headers present; SOT §13 updated with URL.
**Tests:** smoke e2e against production URL.
