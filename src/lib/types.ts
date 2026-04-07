// Euka A/B Test
export interface EukaTest {
  testId: string;
  testName: string;
  messageType: 'target_collab' | 'spark_code' | 'creative_brief' | 'welcome' | 'content_nudge' | 'first_sale';
  status: 'running' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  variantA: EukaVariant;
  variantB: EukaVariant;
  winner: 'variant_a' | 'variant_b' | 'none' | '';
  notes: string;
}

export interface EukaVariant {
  name: string;
  agent: string;
  reached: number;
  requests: number;
  shipped: number;
  requestRate: number;
  videos: number;
  postRate: number;
  revenue: number;
}

// Email A/B Test
export interface EmailTest {
  testId: string;
  testName: string;
  testType: 'subject_line' | 'email_body';
  status: 'running' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  variantA: EmailVariant;
  variantB: EmailVariant;
  winner: 'variant_a' | 'variant_b' | 'none' | '';
  notes: string;
}

export interface EmailVariant {
  name: string;
  sent: number;
  opens: number;
  openRate: number;
  clicks: number;
  ctr: number;
  replies: number;
}

// Message Library
export interface Message {
  messageId: string;
  funnelStage: 'outreach' | 'spark_code' | 'creative_brief' | 'welcome' | 'nudge' | 'celebration';
  channel: 'euka' | 'email';
  variantLabel: string;
  fullCopy: string;
  usedInTests: string;
  isCurrent: boolean;
}

// Config
export interface Config {
  [key: string]: string;
}

// Dashboard summary
export interface DashboardSummary {
  totalTests: number;
  activeTests: number;
  completedTests: number;
  avgImprovementPercent: number;
  bestPerformer: { testName: string; metric: string; improvement: string } | null;
}
