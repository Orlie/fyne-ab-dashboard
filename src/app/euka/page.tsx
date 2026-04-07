'use client';

import { useState } from 'react';
import { useFetch, useMutation } from '@/lib/hooks';
import { EukaTest } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import WinnerBadge from '@/components/WinnerBadge';
import QuickEditModal from '@/components/QuickEditModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { getConfidence, percentDiff } from '@/lib/parse';
import Link from 'next/link';

const MESSAGE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'target_collab', label: 'Target Collab' },
  { value: 'spark_code', label: 'Spark Code' },
  { value: 'creative_brief', label: 'Creative Brief' },
  { value: 'welcome', label: 'Welcome' },
  { value: 'content_nudge', label: 'Content Nudge' },
  { value: 'first_sale', label: 'First Sale' },
];

export default function EukaTestsPage() {
  const { data: tests, loading, error, refetch } = useFetch<EukaTest[]>('/api/euka');
  const { mutate: updateTest } = useMutation<EukaTest>('/api/euka', 'PUT');
  const { mutate: deleteTest } = useMutation<unknown>('/api/euka', 'DELETE');
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Quick Edit state
  const [editingTest, setEditingTest] = useState<EukaTest | null>(null);
  // Delete state
  const [deletingTest, setDeletingTest] = useState<EukaTest | null>(null);

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!tests) return null;

  const filtered = tests.filter((t) => {
    if (filter !== 'all' && t.messageType !== filter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  async function handleQuickEditSave(updates: Record<string, string>) {
    if (!editingTest) return;
    const updated: EukaTest = {
      ...editingTest,
      status: updates.status as EukaTest['status'],
      winner: updates.winner as EukaTest['winner'],
      notes: updates.notes,
    };
    try {
      await updateTest(updated);
      refetch();
    } catch {
      // error handled by useMutation
    }
    setEditingTest(null);
  }

  async function handleDeleteConfirm() {
    if (!deletingTest) return;
    try {
      await deleteTest({ testId: deletingTest.testId });
      refetch();
    } catch {
      // error handled by useMutation
    }
    setDeletingTest(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Euka Bot A/B Tests</h1>
          <p className="text-gray-500 text-sm mt-1">Compare message variants sent through Euka outreach agents</p>
        </div>
        <Link href="/euka/new" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
          + New Test
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {MESSAGE_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
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
          filtered.map((test) => (
            <EukaTestCard
              key={test.testId}
              test={test}
              onEdit={() => setEditingTest(test)}
              onDelete={() => setDeletingTest(test)}
            />
          ))
        )}
      </div>

      {/* Quick Edit Modal */}
      <QuickEditModal
        open={!!editingTest}
        onClose={() => setEditingTest(null)}
        onSave={handleQuickEditSave}
        title={editingTest ? `Edit: ${editingTest.testName}` : 'Edit Test'}
        fields={[
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            value: editingTest?.status ?? 'running',
            options: [
              { value: 'running', label: 'Running' },
              { value: 'completed', label: 'Completed' },
              { value: 'paused', label: 'Paused' },
            ],
          },
          {
            key: 'winner',
            label: 'Winner',
            type: 'select',
            value: editingTest?.winner ?? '',
            options: [
              { value: '', label: 'Not determined' },
              { value: 'variant_a', label: 'Variant A' },
              { value: 'variant_b', label: 'Variant B' },
              { value: 'none', label: 'None' },
            ],
          },
          {
            key: 'notes',
            label: 'Notes',
            type: 'textarea',
            value: editingTest?.notes ?? '',
          },
        ]}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingTest}
        title="Delete Test"
        message={`Are you sure you want to delete "${deletingTest?.testName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTest(null)}
      />
    </div>
  );
}

function EukaTestCard({
  test,
  onEdit,
  onDelete,
}: {
  test: EukaTest;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { variantA, variantB } = test;
  const totalReached = variantA.reached + variantB.reached;
  const confidence = getConfidence(variantA.requestRate, variantB.requestRate, totalReached);

  return (
    <Link href={`/test/${test.testId}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{test.testName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {test.messageType.replace(/_/g, ' ')} &middot; Started {test.startDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
              className="text-xs text-gray-400 hover:text-emerald-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
              className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Delete
            </button>
            <WinnerBadge confidence={confidence} winner={test.winner ? test[test.winner === 'variant_a' ? 'variantA' : 'variantB']?.name : undefined} />
            <StatusBadge status={test.status} />
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-4">
          <VariantColumn label="A" variant={variantA} revPerCreator={variantA.reached > 0 ? variantA.revenue / variantA.reached : 0} />
          <VariantColumn label="B" variant={variantB} revPerCreator={variantB.reached > 0 ? variantB.revenue / variantB.reached : 0} />
        </div>

        {/* Notes */}
        {test.notes && (
          <p className="text-xs text-gray-400 mt-3 italic">{test.notes}</p>
        )}
      </div>
    </Link>
  );
}

function VariantColumn({ label, variant, revPerCreator }: { label: string; variant: EukaTest['variantA']; revPerCreator: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs font-medium text-gray-500 mb-2">Variant {label}: {variant.name}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Reached</p>
          <p className="font-semibold text-gray-900">{variant.reached.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Request Rate</p>
          <p className="font-semibold text-gray-900">{(variant.requestRate * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Post Rate</p>
          <p className="font-semibold text-gray-900">{(variant.postRate * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Revenue</p>
          <p className="font-semibold text-gray-900">${variant.revenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Videos</p>
          <p className="font-semibold text-gray-900">{variant.videos}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Rev/Creator</p>
          <p className="font-semibold text-gray-900">${revPerCreator.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
