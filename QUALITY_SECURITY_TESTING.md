# QUALITY, SECURITY, TESTING & ACCESSIBILITY GATES

> These map directly to the evaluation focus areas: **Code Quality · Security · Efficiency · Testing · Accessibility**. Check the relevant sections before marking any feature ✅.

---

## 1. Evaluation map

| Focus area | How this project demonstrates it | Where |
|------------|-----------------------------------|-------|
| Smart, dynamic assistant | Profile + document type drive reading level, focus, actions, escalation | Block E, SOT §7 |
| Logical decision making | Pure, table-tested rules engine with "Why am I seeing this?" explanations | F21, F22 |
| Real-world usability | Upload → understand → ask → compare → checklist/.ics → lawyer brief | Blocks C–J |
| Code quality | Strict TS, layered architecture, small modules, Zod contracts | §2 |
| Security | Stateless server, client-only storage, injection guards, CSP, rate limits, PII redaction | §3 |
| Efficiency | Retrieval top-k, caching by hash, map-reduce, workers, code-splitting | §5 |
| Testing | Unit, integration, E2E, a11y, retrieval eval, mock LLM | §4 |
| Accessibility | WCAG 2.2 AA, keyboard-complete, preferences, both themes | §6 |

---

## 2. Code quality standards

- **Layers:** UI components → hooks/stores → `/lib` domain logic (pure where possible) → API client → route handlers → AI adapter. UI never calls providers; route handlers never contain business rules beyond orchestration.
- **Types:** strict mode, no `any`, no non-null assertions without justification, exhaustive `switch` with `never` checks.
- **Functions:** single responsibility, ≤ 40 lines preferred; files ≤ 250 lines.
- **Naming:** descriptive; domain words from SOT (clause, section, finding, escalation).
- **Errors:** typed error classes (`ValidationError`, `ProviderError`, `RateLimitError`); map to user-friendly copy in one place.
- **No magic values:** limits and thresholds in `/lib/config.ts` or env.
- **Comments:** explain why; JSDoc on exported functions in `/lib`.
- **Commits:** Conventional Commits with feature IDs.

---

## 3. Security checklist

### Data & privacy
- [ ] Documents, profile, chats, checklists stored only in IndexedDB on the user's device
- [ ] Server never persists or logs document text, questions, answers, or PII
- [ ] Optional PII redaction before sending (F13); verified by payload tests
- [ ] "Clear all my data" deletes everything locally
- [ ] Privacy explanation on landing and About pages, in plain language

### Secrets & config
- [ ] API keys only in server env; `server-only` import guard
- [ ] `.env*` git-ignored; `.env.example` has no values
- [ ] Errors never echo env values or stack traces to clients

### Input & output handling
- [ ] Zod validation on every route input and every LLM output
- [ ] File validation: extension + MIME + magic bytes + size
- [ ] Body size limits per route; text length caps (`MAX_DOC_CHARS`)
- [ ] Markdown rendered with sanitization; no `dangerouslySetInnerHTML`
- [ ] `.ics` and Markdown exports escape user/LLM content

### AI-specific
- [ ] Document text delimited and declared untrusted in every prompt
- [ ] Injection phrase detection + user notice
- [ ] Citation verification against source text; invented citations dropped
- [ ] Escalation rules cannot be overridden by document content or user prompt
- [ ] Disclaimers on all AI output; no definitive legal advice language

### Platform
- [ ] CSP (nonce scripts, `connect-src 'self'`, `frame-ancestors 'none'`), HSTS, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
- [ ] Rate limiting per IP with `Retry-After`
- [ ] Dependency audit in CI (no high/critical)
- [ ] Docker image runs as non-root (if Cloud Run)

---

## 4. Testing strategy

### 4.1 Pyramid

| Level | Tool | Scope | Target |
|-------|------|-------|--------|
| Unit | Vitest | `/lib` (engine rules, segmenter, redaction, guards, cache keys, exporters, retrieval, validators) | ≥ 80% line coverage of `/lib`; 100% of engine rules |
| Component | Vitest + Testing Library | UI primitives, tabs, chips, forms | Behavior + ARIA + keyboard |
| Integration | Vitest + MSW / route handler tests | Each `/api/*` route with mock provider; client ↔ API contracts | Happy, invalid, oversized, rate-limited, injection |
| E2E | Playwright | Five core journeys (see F40), both themes, three viewports | All green in CI |
| Accessibility | @axe-core/playwright + manual SR checklist | Every route, both themes | Zero serious/critical violations |
| AI quality | Fixture evals | Retrieval hit rate ≥ 85%; citation validity 100% after guard; schema pass rate | Tracked in `tests/evals/` |

### 4.2 Fixtures (`/tests/fixtures`)
- Synthetic documents: residential lease (v1 and v2 for comparison), employment offer with non-compete, NDA, terms of service with auto-renewal and arbitration, legal notice with a near deadline, a non-legal document (recipe), a document with an embedded prompt-injection, a long document (> 60k chars), a document with a seeded inconsistency.
- Mock LLM outputs per task per fixture in `/tests/fixtures/llm/`.
- Q&A evaluation set: ≥ 15 question → expected clause ID pairs.

### 4.3 Rules
- No real network in tests (`LLM_PROVIDER=mock`, MSW for fetch).
- Tests are deterministic (fixed dates via fake timers for deadline logic).
- Every bug fix adds a regression test.

---

## 5. Performance & efficiency budgets

| Metric | Budget |
|--------|--------|
| Landing LCP (4G, mid-range mobile) | < 2.5 s |
| CLS | < 0.1 |
| INP | < 200 ms |
| Initial JS (landing) | < 170 KB gzipped |
| Texture assets | < 30 KB total |
| Parse 30-page PDF | < 4 s, UI responsive (worker) |
| Q&A request payload | ≤ top-6 clauses + ≤ 6 turns |
| Repeated analysis | 0 network calls (cache hit) |

Techniques: Web Worker parsing, dynamic imports for pdfjs/compare/brief, list virtualization, memoization, streaming responses, content-hash caching, request de-duplication and abort, map-reduce for long docs, low temperature + compact prompts.

---

## 6. Accessibility checklist

- [ ] Semantic landmarks; one `h1` per page; logical heading order
- [ ] Skip-to-content link
- [ ] Full keyboard operation: upload, tabs, chat, citations, dialogs, drawer, checklist
- [ ] Focus management on route change, dialog open/close, and citation jumps
- [ ] Visible focus rings in both themes
- [ ] Live regions for async status; streaming answer announced once when complete
- [ ] Form fields have labels, descriptions, and error messages linked via `aria-describedby`
- [ ] Risk, change, and status indicators use icon + text + color
- [ ] Contrast AA in both themes (AAA body text in high-contrast mode)
- [ ] Respects `prefers-reduced-motion`, `prefers-color-scheme`; user overrides available
- [ ] Text zoom to 200%; reflow at 320px width
- [ ] `lang` attribute matches UI language; documents in other languages marked with `lang` where known
- [ ] Plain-language copy (grade ~8); jargon explained via glossary
- [ ] Manual screen-reader pass (NVDA or VoiceOver) recorded in the tracker

---

## 7. Pre-merge checklist (quick)

```
[ ] pnpm lint && pnpm typecheck && pnpm test   → all green
[ ] pnpm test:e2e (if UI touched)              → all green
[ ] Light + dark + mobile checked
[ ] No secrets, no stray console.log, no untracked TODO
[ ] Tracker + Decision Log updated
```
