import { EukaTest, EmailTest, Message } from './types';

/** Parse a percentage string like "1.8%" to 0.018, or a plain number */
export function parsePercent(value: string): number {
  if (!value || value === '—' || value === '-') return 0;
  const cleaned = value.replace('%', '').trim();
  return parseFloat(cleaned) / 100 || 0;
}

/** Parse currency string like "$3,740.24" to 3740.24 */
export function parseCurrency(value: string): number {
  if (!value || value === '—' || value === '-') return 0;
  const cleaned = value.replace(/[$,]/g, '').trim();
  return parseFloat(cleaned) || 0;
}

/** Parse a number string, handling blanks and dashes */
export function parseNum(value: string): number {
  if (!value || value === '—' || value === '-') return 0;
  return parseInt(value.replace(/,/g, ''), 10) || 0;
}

/** Parse a row from euka_tests sheet into EukaTest */
export function parseEukaRow(row: string[]): EukaTest {
  return {
    testId: row[0] || '',
    testName: row[1] || '',
    messageType: (row[2] || 'target_collab') as EukaTest['messageType'],
    status: (row[3] || 'running') as EukaTest['status'],
    startDate: row[4] || '',
    endDate: row[5] || '',
    variantA: {
      name: row[6] || '',
      agent: row[7] || '',
      reached: parseNum(row[8]),
      requests: parseNum(row[9]),
      shipped: parseNum(row[10]),
      requestRate: parsePercent(row[11]),
      videos: parseNum(row[12]),
      postRate: parsePercent(row[13]),
      revenue: parseCurrency(row[14]),
    },
    variantB: {
      name: row[15] || '',
      agent: row[16] || '',
      reached: parseNum(row[17]),
      requests: parseNum(row[18]),
      shipped: parseNum(row[19]),
      requestRate: parsePercent(row[20]),
      videos: parseNum(row[21]),
      postRate: parsePercent(row[22]),
      revenue: parseCurrency(row[23]),
    },
    winner: (row[24] || '') as EukaTest['winner'],
    notes: row[25] || '',
  };
}

/** Parse a row from email_tests sheet into EmailTest */
export function parseEmailRow(row: string[]): EmailTest {
  return {
    testId: row[0] || '',
    testName: row[1] || '',
    testType: (row[2] || 'subject_line') as EmailTest['testType'],
    status: (row[3] || 'running') as EmailTest['status'],
    startDate: row[4] || '',
    endDate: row[5] || '',
    variantA: {
      name: row[6] || '',
      sent: parseNum(row[7]),
      opens: parseNum(row[8]),
      openRate: parsePercent(row[9]),
      clicks: parseNum(row[10]),
      ctr: parsePercent(row[11]),
      replies: parseNum(row[12]),
    },
    variantB: {
      name: row[13] || '',
      sent: parseNum(row[14]),
      opens: parseNum(row[15]),
      openRate: parsePercent(row[16]),
      clicks: parseNum(row[17]),
      ctr: parsePercent(row[18]),
      replies: parseNum(row[19]),
    },
    winner: (row[20] || '') as EmailTest['winner'],
    notes: row[21] || '',
  };
}

/** Parse a row from messages sheet into Message */
export function parseMessageRow(row: string[]): Message {
  return {
    messageId: row[0] || '',
    funnelStage: (row[1] || 'outreach') as Message['funnelStage'],
    channel: (row[2] || 'euka') as Message['channel'],
    variantLabel: row[3] || '',
    fullCopy: row[4] || '',
    usedInTests: row[5] || '',
    isCurrent: row[6]?.toUpperCase() === 'TRUE',
  };
}

/** Determine winner confidence level */
export function getConfidence(
  variantAMetric: number,
  variantBMetric: number,
  sampleSize: number
): 'high' | 'medium' | 'low' {
  if (sampleSize < 500) return 'low';
  const diff = Math.abs(variantAMetric - variantBMetric);
  const avg = (variantAMetric + variantBMetric) / 2;
  if (avg === 0) return 'low';
  const percentDiff = diff / avg;
  if (sampleSize >= 1000 && percentDiff >= 0.2) return 'high';
  if (sampleSize >= 500 && percentDiff >= 0.1) return 'medium';
  return 'low';
}

/** Calculate percent difference between two values */
export function percentDiff(a: number, b: number): number {
  if (b === 0) return a > 0 ? 100 : 0;
  return ((a - b) / b) * 100;
}

// ── Serializers (object → sheet row) ──────────────────────────────────

/** Format a decimal as percentage string: 0.08 → "8.0%" */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/** Format a number as currency string: 740.24 → "$740.24" */
export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a number with commas: 16377 → "16,377" */
export function formatNum(value: number): string {
  return value.toLocaleString('en-US');
}

/** Serialize EukaTest back to sheet row format (26 columns, matching parseEukaRow column order) */
export function serializeEukaRow(test: EukaTest): string[] {
  const a = test.variantA;
  const b = test.variantB;
  return [
    test.testId,
    test.testName,
    test.messageType,
    test.status,
    test.startDate,
    test.endDate,
    a.name,
    a.agent,
    formatNum(a.reached),
    formatNum(a.requests),
    formatNum(a.shipped),
    formatPercent(a.requestRate),
    formatNum(a.videos),
    formatPercent(a.postRate),
    formatCurrency(a.revenue),
    b.name,
    b.agent,
    formatNum(b.reached),
    formatNum(b.requests),
    formatNum(b.shipped),
    formatPercent(b.requestRate),
    formatNum(b.videos),
    formatPercent(b.postRate),
    formatCurrency(b.revenue),
    test.winner,
    test.notes,
  ];
}

/** Serialize EmailTest back to sheet row format (22 columns, matching parseEmailRow column order) */
export function serializeEmailRow(test: EmailTest): string[] {
  const a = test.variantA;
  const b = test.variantB;
  return [
    test.testId,
    test.testName,
    test.testType,
    test.status,
    test.startDate,
    test.endDate,
    a.name,
    formatNum(a.sent),
    formatNum(a.opens),
    formatPercent(a.openRate),
    formatNum(a.clicks),
    formatPercent(a.ctr),
    formatNum(a.replies),
    b.name,
    formatNum(b.sent),
    formatNum(b.opens),
    formatPercent(b.openRate),
    formatNum(b.clicks),
    formatPercent(b.ctr),
    formatNum(b.replies),
    test.winner,
    test.notes,
  ];
}

/** Serialize Message back to sheet row format (7 columns, matching parseMessageRow column order) */
export function serializeMessageRow(msg: Message): string[] {
  return [
    msg.messageId,
    msg.funnelStage,
    msg.channel,
    msg.variantLabel,
    msg.fullCopy,
    msg.usedInTests,
    msg.isCurrent ? 'TRUE' : 'FALSE',
  ];
}
