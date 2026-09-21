# Lawesy - AI Legal Companion

Lawesy is an intelligent legal document analysis tool. It translates dense contracts into plain language, highlights hidden risks, and tells you what to watch out for based on your specific role and jurisdiction.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS & Custom CSS Variables (Design System)
- **State & Storage:** IndexedDB (Local-first, privacy-focused storage)
- **AI Integration:** Vercel AI SDK (@ai-sdk/google)
- **Rate Limiting:** Upstash Redis (`@upstash/ratelimit`)

## Architecture & Frameworks
- **AI Processing:** Uses Google's Gemini models via the Vercel AI SDK to stream text and generate structured JSON schemas (Zod).
- **Upstash Redis:** Used strictly for API rate-limiting to protect AI endpoints from abuse. No user documents or chat logs are stored in Redis — they remain entirely local to the user's browser via IndexedDB.
- **Multilingual:** Built-in localization support for English, Hindi, and Tamil, with dynamic font fallbacks for Indian scripts (Noto Sans).
- **Security:** Strict Content-Security-Policy (CSP) headers, HSTS, and nosniff rules implemented in middleware.

## Local Development Startup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shaurja2005/Lawesy-an-AI-Legal-Companion.git
   cd Lawesy-an-AI-Legal-Companion
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` (or create a new `.env` file) and fill in the required keys:
   ```env
   # LLM Provider Configuration
   LLM_PROVIDER=gemini
   LLM_MODEL=gemini-2.5-flash
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

   # Upstash Redis (For Rate Limiting)
   UPSTASH_REDIS_REST_URL=your_upstash_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
   RATE_LIMIT_PER_MIN=30
   ```
   *Note: If Upstash keys are omitted, rate limiting is bypassed locally.*

4. **Run the development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Deployment to Vercel

Lawesy is optimized for Vercel deployment.

1. **Connect GitHub Repo to Vercel**
   - Log into [Vercel](https://vercel.com) and click **Add New Project**.
   - Import your GitHub repository (`Lawesy-an-AI-Legal-Companion`).

2. **Configure Environment Variables**
   - In the Vercel project configuration, add your API keys:
     - `LLM_PROVIDER` (e.g., `gemini`)
     - `LLM_MODEL` (e.g., `gemini-2.5-flash`)
     - `GOOGLE_GENERATIVE_AI_API_KEY`
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
     - `RATE_LIMIT_PER_MIN`

3. **Deploy**
   - Vercel will automatically detect Next.js and run `pnpm build`.
   - Once deployed, your site will be live. Subsequent pushes to the `main` branch will trigger automatic deployments.

## Disclaimer
Lawesy provides AI-generated information to help you understand documents. **This is not legal advice.** For any document with serious financial, legal, or personal consequences, please consult a qualified solicitor or lawyer in your jurisdiction.
