import { describe, it, expect } from 'vitest';
import { redactPII } from '../../lib/redact';

describe('redactPII', () => {
  it('should redact email addresses', () => {
    const { redactedText } = redactPII('Contact john.doe@example.com for more info.');
    expect(redactedText).toContain('[EMAIL]');
    expect(redactedText).not.toContain('john.doe@example.com');
  });

  it('should redact UK NI numbers', () => {
    const { redactedText } = redactPII('NI number: AB 12 34 56 C');
    expect(redactedText).toContain('[UK_NI]');
  });

  it('should redact US SSNs', () => {
    const { redactedText } = redactPII('SSN: 123-45-6789');
    expect(redactedText).toContain('[US_SSN]');
  });

  it('should redact passport numbers', () => {
    const { redactedText } = redactPII('Passport: GB1234567');
    expect(redactedText).toContain('[PASSPORT]');
  });

  it('should return stats for each category', () => {
    const { stats } = redactPII('foo@bar.com and baz@qux.io');
    expect(stats.EMAIL).toBe(2);
  });

  it('should not redact clean text', () => {
    const clean = 'The quick brown fox jumps over the lazy dog.';
    const { redactedText, stats } = redactPII(clean);
    expect(redactedText).toBe(clean);
    expect(Object.keys(stats)).toHaveLength(0);
  });
});
