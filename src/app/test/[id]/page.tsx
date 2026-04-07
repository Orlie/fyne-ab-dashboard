'use client';

import { use } from 'react';
import { useFetch } from '@/lib/hooks';
import { EukaTest, EmailTest } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import WinnerBadge from '@/components/WinnerBadge';
import FunnelChart from '@/components/FunnelChart';
import ComparisonRow from '@/components/ComparisonRow';
import { getConfidence } from '@/lib/parse';
import Link from 'next/link';

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isEuka = id.startsWith('euka');

  if (isEuka) return <EukaDetail testId={id} />;
  return <EmailDetail testId={id} />;
}

function EukaDetail({ testId }: { testId: string }) {
  const { data: tests, loading, error } = useFetch<EukaTest[]>('/api/euka');

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />;
  if (error) return <p className="text-red-600">{error}</p>;

  const test = tests?.find((t) => t.testId === testId);
  if (!test) return <p className="text-gray-500">Test not found</p>;

  const { variantA: a, variantB: b } = test;
  const totalReached = a.reached + b.reached;
  const confidence = getConfidence(a.requestRate, b.requestRate, totalReached);

  const revPerA = a.reached > 0 ? a.revenue / a.reached : 0;
  const revPerB = b.reached > 0 ? b.revenue / b.reached : 0;

  const funnelData = [
    { stage: 'Reached', variantA: a.reached, variantB: b.reached },
    { stage: 'Requests', variantA: a.requests, variantB: b.requests },
    { stage: 'Shipped', variantA: a.shipped, variantB: b.shipped },
    { stage: 'Videos', variantA: a.videos, variantB: b.videos },
  ];

  return (
    <div>
      <Link href="/euka" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">&larr; Back to Euka Tests</Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{test.testName}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {test.messageType.replace(/_/g, ' ')} &middot; Started {test.startDate}
            {test.endDate && ` \u00b7 Ended ${test.endDate}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WinnerBadge confidence={confidence} winner={test.winner ? (test.winner === 'variant_a' ? a.name : b.name) : undefined} />
          <StatusBadge status={test.status} />
        </div>
      </div>

      {/* Funnel Chart */}
      <FunnelChart data={funnelData} variantAName={a.name} variantBName={b.name} />

      {/* Detailed Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Detailed Comparison</h3>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="w-28 text-right font-medium">{a.name}</span>
            <span className="w-28 text-right font-medium">{b.name}</span>
            <span className="w-20 text-right">Diff</span>
          </div>
        </div>
        <ComparisonRow label="Reached" valueA={a.reached} valueB={b.reached} />
        <ComparisonRow label="Requests" valueA={a.requests} valueB={b.requests} />
        <ComparisonRow label="Shipped" valueA={a.shipped} valueB={b.shipped} />
        <ComparisonRow label="Request Rate" valueA={a.requestRate} valueB={b.requestRate} format="percent" />
        <ComparisonRow label="Videos" valueA={a.videos} valueB={b.videos} />
        <ComparisonRow label="Post Rate" valueA={a.postRate} valueB={b.postRate} format="percent" />
        <ComparisonRow label="Revenue" valueA={a.revenue} valueB={b.revenue} format="currency" />
        <ComparisonRow label="Rev/Creator" valueA={revPerA} valueB={revPerB} format="currency" />
      </div>

      {/* Notes */}
      {test.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
          <p className="text-sm text-amber-800"><strong>Notes:</strong> {test.notes}</p>
        </div>
      )}
    </div>
  );
}

function EmailDetail({ testId }: { testId: string }) {
  const { data: tests, loading, error } = useFetch<EmailTest[]>('/api/email');

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />;
  if (error) return <p className="text-red-600">{error}</p>;

  const test = tests?.find((t) => t.testId === testId);
  if (!test) return <p className="text-gray-500">Test not found</p>;

  const { variantA: a, variantB: b } = test;
  const totalSent = a.sent + b.sent;
  const confidence = getConfidence(a.openRate, b.openRate, totalSent);

  const funnelData = [
    { stage: 'Sent', variantA: a.sent, variantB: b.sent },
    { stage: 'Opens', variantA: a.opens, variantB: b.opens },
    { stage: 'Clicks', variantA: a.clicks, variantB: b.clicks },
    { stage: 'Replies', variantA: a.replies, variantB: b.replies },
  ];

  return (
    <div>
      <Link href="/email" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">&larr; Back to Email Tests</Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{test.testName}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {test.testType === 'subject_line' ? 'Subject Line' : 'Email Body'} &middot; Started {test.startDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WinnerBadge confidence={confidence} winner={test.winner ? (test.winner === 'variant_a' ? a.name : b.name) : undefined} />
          <StatusBadge status={test.status} />
        </div>
      </div>

      <FunnelChart data={funnelData} variantAName={a.name} variantBName={b.name} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Detailed Comparison</h3>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="w-28 text-right font-medium">{a.name}</span>
            <span className="w-28 text-right font-medium">{b.name}</span>
            <span className="w-20 text-right">Diff</span>
          </div>
        </div>
        <ComparisonRow label="Sent" valueA={a.sent} valueB={b.sent} />
        <ComparisonRow label="Opens" valueA={a.opens} valueB={b.opens} />
        <ComparisonRow label="Open Rate" valueA={a.openRate} valueB={b.openRate} format="percent" />
        <ComparisonRow label="Clicks" valueA={a.clicks} valueB={b.clicks} />
        <ComparisonRow label="CTR" valueA={a.ctr} valueB={b.ctr} format="percent" />
        <ComparisonRow label="Replies" valueA={a.replies} valueB={b.replies} />
      </div>

      {test.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
          <p className="text-sm text-amber-800"><strong>Notes:</strong> {test.notes}</p>
        </div>
      )}
    </div>
  );
}
