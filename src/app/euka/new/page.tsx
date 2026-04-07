'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@/lib/hooks';
import { EukaTest } from '@/lib/types';

const today = () => new Date().toISOString().slice(0, 10);

export default function NewEukaTestPage() {
  const router = useRouter();
  const { mutate, loading, error } = useMutation<EukaTest>('/api/euka', 'POST');

  // Test Info
  const [testId, setTestId] = useState('');
  const [testName, setTestName] = useState('');
  const [messageType, setMessageType] = useState<EukaTest['messageType']>('target_collab');
  const [status, setStatus] = useState<EukaTest['status']>('running');
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState('');

  // Variant A
  const [aName, setAName] = useState('');
  const [aAgent, setAAgent] = useState('');
  const [aReached, setAReached] = useState(0);
  const [aRequests, setARequests] = useState(0);
  const [aShipped, setAShipped] = useState(0);
  const [aVideos, setAVideos] = useState(0);
  const [aRequestRate, setARequestRate] = useState(0);
  const [aPostRate, setAPostRate] = useState(0);
  const [aRevenue, setARevenue] = useState(0);

  // Variant B
  const [bName, setBName] = useState('');
  const [bAgent, setBAgent] = useState('');
  const [bReached, setBReached] = useState(0);
  const [bRequests, setBRequests] = useState(0);
  const [bShipped, setBShipped] = useState(0);
  const [bVideos, setBVideos] = useState(0);
  const [bRequestRate, setBRequestRate] = useState(0);
  const [bPostRate, setBPostRate] = useState(0);
  const [bRevenue, setBRevenue] = useState(0);

  // Result
  const [winner, setWinner] = useState<EukaTest['winner']>('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const test: EukaTest = {
      testId,
      testName,
      messageType,
      status,
      startDate,
      endDate,
      variantA: {
        name: aName,
        agent: aAgent,
        reached: aReached,
        requests: aRequests,
        shipped: aShipped,
        requestRate: aRequestRate,
        videos: aVideos,
        postRate: aPostRate,
        revenue: aRevenue,
      },
      variantB: {
        name: bName,
        agent: bAgent,
        reached: bReached,
        requests: bRequests,
        shipped: bShipped,
        requestRate: bRequestRate,
        videos: bVideos,
        postRate: bPostRate,
        revenue: bRevenue,
      },
      winner,
      notes,
    };

    try {
      await mutate(test);
      router.push('/euka');
    } catch {
      // error is set by useMutation
    }
  }

  const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white w-full';
  const labelClass = 'text-sm font-medium text-gray-700 mb-1';
  const cardClass = 'bg-white rounded-xl border border-gray-200 shadow-sm p-6';

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/euka" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
        &larr; Back to Euka Tests
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Create Euka A/B Test</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Test Info */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Test ID</label>
              <input
                type="text"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                placeholder="euka-tc-003"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Test Name</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Message Type</label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as EukaTest['messageType'])}
                className={inputClass}
              >
                <option value="target_collab">Target Collab</option>
                <option value="spark_code">Spark Code</option>
                <option value="creative_brief">Creative Brief</option>
                <option value="welcome">Welcome</option>
                <option value="content_nudge">Content Nudge</option>
                <option value="first_sale">First Sale</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EukaTest['status'])}
                className={inputClass}
              >
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Variant A */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Variant A</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={aName}
                onChange={(e) => setAName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Agent</label>
              <input
                type="text"
                value={aAgent}
                onChange={(e) => setAAgent(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Reached</label>
              <input
                type="number"
                value={aReached}
                onChange={(e) => setAReached(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Requests</label>
              <input
                type="number"
                value={aRequests}
                onChange={(e) => setARequests(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Shipped</label>
              <input
                type="number"
                value={aShipped}
                onChange={(e) => setAShipped(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Videos</label>
              <input
                type="number"
                value={aVideos}
                onChange={(e) => setAVideos(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Request Rate (e.g. 0.08 for 8%)</label>
              <input
                type="number"
                step="0.001"
                value={aRequestRate}
                onChange={(e) => setARequestRate(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Post Rate (e.g. 0.08 for 8%)</label>
              <input
                type="number"
                step="0.001"
                value={aPostRate}
                onChange={(e) => setAPostRate(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Revenue</label>
              <input
                type="number"
                step="0.01"
                value={aRevenue}
                onChange={(e) => setARevenue(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Variant B */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Variant B</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={bName}
                onChange={(e) => setBName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Agent</label>
              <input
                type="text"
                value={bAgent}
                onChange={(e) => setBAgent(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Reached</label>
              <input
                type="number"
                value={bReached}
                onChange={(e) => setBReached(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Requests</label>
              <input
                type="number"
                value={bRequests}
                onChange={(e) => setBRequests(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Shipped</label>
              <input
                type="number"
                value={bShipped}
                onChange={(e) => setBShipped(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Videos</label>
              <input
                type="number"
                value={bVideos}
                onChange={(e) => setBVideos(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Request Rate (e.g. 0.08 for 8%)</label>
              <input
                type="number"
                step="0.001"
                value={bRequestRate}
                onChange={(e) => setBRequestRate(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Post Rate (e.g. 0.08 for 8%)</label>
              <input
                type="number"
                step="0.001"
                value={bPostRate}
                onChange={(e) => setBPostRate(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Revenue</label>
              <input
                type="number"
                step="0.01"
                value={bRevenue}
                onChange={(e) => setBRevenue(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Result */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Result</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Winner</label>
              <select
                value={winner}
                onChange={(e) => setWinner(e.target.value as EukaTest['winner'])}
                className={inputClass}
              >
                <option value="">Not determined</option>
                <option value="variant_a">Variant A</option>
                <option value="variant_b">Variant B</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Test'}
        </button>
      </form>
    </div>
  );
}
