'use client';

import { useFetch } from '@/lib/hooks';
import { EukaTest, EmailTest, DashboardSummary } from '@/lib/types';
import MetricCard from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

interface DashboardData {
  summary: DashboardSummary;
  eukaTests: EukaTest[];
  emailTests: EmailTest[];
}

export default function Dashboard() {
  const { data, loading, error } = useFetch<DashboardData>('/api/dashboard');

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  const { summary, eukaTests, emailTests } = data;
  const activeEuka = eukaTests.filter((t) => t.status === 'running');
  const activeEmail = emailTests.filter((t) => t.status === 'running');
  const recentCompleted = [...eukaTests, ...emailTests]
    .filter((t) => t.status === 'completed')
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">A/B testing overview for creator outreach</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Tests" value={summary.totalTests} />
        <MetricCard label="Active Tests" value={summary.activeTests} subtitle="Currently running" trend="neutral" />
        <MetricCard label="Completed" value={summary.completedTests} />
        <MetricCard
          label="Best Improvement"
          value={summary.bestPerformer?.improvement || 'N/A'}
          subtitle={summary.bestPerformer?.testName || 'No completed tests yet'}
          trend="up"
        />
      </div>

      {/* Active Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Active Euka Tests */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Active Euka Tests</h2>
            <Link href="/euka" className="text-sm text-emerald-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {activeEuka.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No active Euka tests</p>
            ) : (
              activeEuka.map((test) => (
                <Link key={test.testId} href={`/test/${test.testId}`} className="block p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{test.testName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {test.variantA.name} vs {test.variantB.name}
                      </p>
                    </div>
                    <StatusBadge status={test.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Active Email Tests */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Active Email Tests</h2>
            <Link href="/email" className="text-sm text-emerald-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {activeEmail.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No active email tests</p>
            ) : (
              activeEmail.map((test) => (
                <Link key={test.testId} href={`/test/${test.testId}`} className="block p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{test.testName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {test.variantA.name} vs {test.variantB.name}
                      </p>
                    </div>
                    <StatusBadge status={test.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Completed */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recently Completed</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentCompleted.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No completed tests yet</p>
          ) : (
            recentCompleted.map((test) => (
              <Link key={test.testId} href={`/test/${test.testId}`} className="block p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{test.testName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Winner: {test.winner || 'TBD'}</p>
                  </div>
                  <StatusBadge status={test.status} />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-red-800 font-medium">Failed to load dashboard</p>
      <p className="text-red-600 text-sm mt-1">{message}</p>
      <p className="text-gray-500 text-xs mt-3">Check that your Google Sheets credentials are configured in .env.local</p>
    </div>
  );
}
