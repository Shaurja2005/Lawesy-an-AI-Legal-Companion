/**
 * Quick smoke-test for the Gemini API key.
 * Run from repo root: node --env-file=.env scripts/test-api-key.mjs
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const model  = process.env.LLM_MODEL ?? 'gemini-2.5-flash';

if (!apiKey) {
  console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY is not set in .env');
  process.exit(1);
}

console.log(`🔑 Key:   ${apiKey.slice(0, 12)}...`);
console.log(`🤖 Model: ${model}`);
console.log(`⏳ Sending test prompt…\n`);

const google = createGoogleGenerativeAI({ apiKey });

try {
  const { text, usage } = await generateText({
    model: google(model),
    prompt: 'Reply with only the words: API KEY OK',
  });

  if (text.trim().toLowerCase().includes('api key ok')) {
    console.log('✅  API key is working!\n');
    console.log(`   Model reply : "${text.trim()}"`);
    console.log(`   Tokens used : ${usage?.totalTokens ?? 'unknown'}`);
  } else {
    console.warn('⚠️  Got a response but not the expected text:');
    console.warn(`   "${text.trim()}"`);
  }
} catch (err) {
  console.error('❌  API call failed:\n');
  console.error(`   ${err.message ?? err}`);
  process.exit(1);
}
