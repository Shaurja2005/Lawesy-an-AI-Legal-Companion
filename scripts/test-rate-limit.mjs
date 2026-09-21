/**
 * Script to test the rate limit
 */

async function run() {
  console.log('Testing rate limit against /api/classify...');
  let successCount = 0;
  let rateLimitCount = 0;

  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch('http://localhost:3000/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '127.0.0.1' // Simulate an IP address
        },
        body: JSON.stringify({
          text: 'This is a test document.',
          language: 'en'
        })
      });

      if (res.status === 200) {
        successCount++;
        console.log(`[Request ${i + 1}] ✅ 200 OK - Remaining: ${res.headers.get('X-RateLimit-Remaining')}`);
      } else if (res.status === 429) {
        rateLimitCount++;
        console.log(`[Request ${i + 1}] ⛔ 429 Rate Limited! Retry-After: ${res.headers.get('Retry-After')}`);
      } else {
         console.log(`[Request ${i + 1}] ⚠️ ${res.status}`);
      }
    } catch (err) {
      console.error(`Request ${i + 1} failed:`, err.message);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Successful requests: ${successCount}`);
  console.log(`Rate limited requests: ${rateLimitCount}`);
}

run();
