'use client';

import { useState } from 'react';
import { useFetch } from '@/lib/hooks';
import { EmailTest } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import WinnerBadge from '@/components/WinnerBadge';
import { getConfidence, percentDiff } from '@/lib/parse';
import Link from 'next/link';

export default function EmailTestsPage() {
  const { data: tests, loading, error } = useFetch<EmailTest[]>('/api/email');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!tests) return null;

  const filtered = tests.filter((t) => {
    if (typeFilter !== 'all' && t.testType !== typeFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email A/B Tests</h1>
        <p className="text-gray-500 text-sm mt-1">Compare email subject lines and body copy variants</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">All Types</option>
          <option value="subject_line">Subject Lines</option>
          <option value="email_body">Email Body</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Test Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm">No tests match your filters</p>
        ) : (
          filtered.map((test) => <EmailTestCard key={test.testId} test={test} />)
        )}
      </div>
    </div>
  );
}

function EmailTestCard({ test }: { test: EmailTest }) {
  const { variantA, variantB } = test;
  const totalSent = variantA.sent + variantB.sent;
  const confidence = getConfidence(variantA.openRate, variantB.openRate, totalSent);

  return (
    <Link href={`/test/${test.testId}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{test.testName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {test.testType === 'subject_line' ? 'Subject Line' : 'Email Body'} &middot; Started {test.startDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <WinnerBadge confidence={confidence} winner={test.winner ? (test.winner === 'variant_a' ? variantA.name : variantB.name) : undefined} />
            <StatusBadge status={test.status} />
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-4">
          <EmailVariantColumn label="A" variant={variantA} />
          <EmailVariantColumn label="B" variant={variantB} />
        </div>

        {test.notes && (
          <p className="text-xs text-gray-400 mt-3 italic">{test.notes}</p>
        )}
      </div>
    </Link>
  );
}

function EmailVariantColumn({ label, variant }: { label: string; variant: EmailTest['variantA'] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs font-medium text-gray-500 mb-2">Variant {label}: {variant.name}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Sent</p>
          <p className="font-semibold text-gray-900">{variant.sent.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Open Rate</p>
          <p className="font-semibold text-gray-900">{(variant.openRate * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">CTR</p>
          <p className="font-semibold text-gray-900">{(variant.ctr * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Replies</p>
          <p className="font-semibold text-gray-900">{variant.replies}</p>
        </div>
      </div>
    </div>
  );
}
