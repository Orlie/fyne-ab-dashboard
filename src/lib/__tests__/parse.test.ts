import { describe, it, expect } from 'vitest';
import {
  parsePercent,
  parseCurrency,
  parseNum,
  parseEukaRow,
  parseEmailRow,
  parseMessageRow,
  getConfidence,
  percentDiff,
} from '../parse';

describe('parsePercent', () => {
  it('parses "1.8%" to 0.018', () => {
    expect(parsePercent('1.8%')).toBeCloseTo(0.018);
  });
  it('parses "75.0%" to 0.75', () => {
    expect(parsePercent('75.0%')).toBeCloseTo(0.75);
  });
  it('returns 0 for blank/dash', () => {
    expect(parsePercent('')).toBe(0);
    expect(parsePercent('—')).toBe(0);
  });
});

describe('parseCurrency', () => {
  it('parses "$3,740.24" to 3740.24', () => {
    expect(parseCurrency('$3,740.24')).toBeCloseTo(3740.24);
  });
  it('parses "0" to 0', () => {
    expect(parseCurrency('0')).toBe(0);
  });
  it('returns 0 for blank', () => {
    expect(parseCurrency('')).toBe(0);
  });
});

describe('parseNum', () => {
  it('parses "16,377" to 16377', () => {
    expect(parseNum('16,377')).toBe(16377);
  });
  it('returns 0 for dash', () => {
    expect(parseNum('—')).toBe(0);
  });
});

describe('parseEukaRow', () => {
  it('parses a full row into EukaTest', () => {
    const row = [
      'euka-tc-001', 'VIP vs Standard', 'target_collab', 'running',
      '2026-04-07', '',
      'VIP 40%', 'Agent A', '16377', '289', '31', '1.8%', '3', '16.1%', '$0',
      'Standard', 'Agent B', '7128', '22', '20', '0.3%', '38', '75.0%', '$3,740.24',
      'variant_b', 'B wins on post rate',
    ];
    const result = parseEukaRow(row);
    expect(result.testId).toBe('euka-tc-001');
    expect(result.variantA.reached).toBe(16377);
    expect(result.variantA.requestRate).toBeCloseTo(0.018);
    expect(result.variantB.revenue).toBeCloseTo(3740.24);
    expect(result.winner).toBe('variant_b');
  });
});

describe('parseEmailRow', () => {
  it('parses a full row into EmailTest', () => {
    const row = [
      'email-subj-001', 'Urgency vs Curiosity', 'subject_line', 'completed',
      '2026-04-01', '2026-04-14',
      'Urgency subject', '500', '145', '29%', '32', '6.4%', '8',
      'Curiosity subject', '500', '120', '24%', '25', '5%', '5',
      'variant_a', 'A wins',
    ];
    const result = parseEmailRow(row);
    expect(result.testId).toBe('email-subj-001');
    expect(result.variantA.openRate).toBeCloseTo(0.29);
    expect(result.variantB.ctr).toBeCloseTo(0.05);
    expect(result.winner).toBe('variant_a');
  });
});

describe('parseMessageRow', () => {
  it('parses a message row', () => {
    const row = ['msg-001', 'outreach', 'euka', 'VIP Pitch', 'Full message...', 'euka-tc-001', 'TRUE'];
    const result = parseMessageRow(row);
    expect(result.isCurrent).toBe(true);
    expect(result.channel).toBe('euka');
  });
});

describe('getConfidence', () => {
  it('returns low for small sample', () => {
    expect(getConfidence(0.05, 0.03, 200)).toBe('low');
  });
  it('returns high for large sample + big diff', () => {
    expect(getConfidence(0.05, 0.01, 5000)).toBe('high');
  });
  it('returns medium for moderate sample + moderate diff', () => {
    expect(getConfidence(0.05, 0.04, 700)).toBe('medium');
  });
});

describe('percentDiff', () => {
  it('calculates percent difference', () => {
    expect(percentDiff(150, 100)).toBeCloseTo(50);
  });
  it('handles zero baseline', () => {
    expect(percentDiff(10, 0)).toBe(100);
    expect(percentDiff(0, 0)).toBe(0);
  });
});
